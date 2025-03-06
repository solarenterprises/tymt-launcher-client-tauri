import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";

import { CONFIG_NETWORK_NAME, CONFIG_OP_API_KEY, CONFIG_OP_API_URL } from "../../config/MainConfig";

import { ISupportToken } from "../../types/ChainTypes";
import { IBalance } from "../../types/WalletTypes";
import { IRecipient } from "../../types/TransactionTypes";
import { CONST_CHAIN_IDS } from "../../const/ChainConsts";
import { CryptoAPI } from "../api/CryptoAPI";

export class Optimism {
  static async getWalletFromMnemonic(mnemonic: string): Promise<any> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdNode = ethereumjsWallet.hdkey.fromMasterSeed(seed);
    const node = hdNode.derivePath(`m/44'/60'/0'`);
    const change = node.deriveChild(0);
    const childNode = change.deriveChild(0);
    const childWallet = childNode.getWallet();
    const wallet = new ethers.Wallet(childWallet.getPrivateKey().toString("hex"));
    return wallet;
  }

  static async getAddress(mnemonic: string): Promise<string> {
    const wallet = await Optimism.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      if (CONFIG_NETWORK_NAME === "testnet") return 0;
      const result = (await (await fetch(`${CONFIG_OP_API_URL}?module=account&action=balance&address=${addr}&tag=latest&apikey=${CONFIG_OP_API_KEY}`)).json())
        .result;
      return (result as number) / 1e9 / 1e9;
    } catch {
      return 0;
    }
  }

  static async getTokenBalance(addr: string, tokens: ISupportToken[]): Promise<IBalance[]> {
    try {
      let result: IBalance[] = [];
      for (let i = 0; i < tokens.length; i++) {
        if (CONFIG_NETWORK_NAME === "testnet") {
          result.push({
            symbol: tokens[i].symbol,
            balance: 0,
          });
        } else {
          result.push({
            symbol: tokens[i].symbol,
            balance:
              ((
                await (
                  await fetch(
                    `${CONFIG_OP_API_URL}?module=account&action=tokenbalance&contractAddress=${tokens[i].address}&address=${addr}&tag=latest&apikey=${CONFIG_OP_API_KEY}`
                  )
                ).json()
              ).result as number) /
              10 ** (tokens[i].decimals as number),
          });
        }
      }
      return result;
    } catch (err) {
      console.error("Failed to OPTIMISM getTokenBalance: ", err);
      return [];
    }
  }

  static async sendTransaction(
    privateKey: string,
    sender: string,
    recipients: IRecipient[]
  ): Promise<{ success: boolean; message?: string; error?: string; data?: any }> {
    let successfulTransactions: string[] = [];
    let failedTransactions: string[] = [];
    const transactionResults: { [address: string]: string } = {};

    try {
      const gasLimit = 22000;
      const chainId = CONST_CHAIN_IDS.OPTIMISM;
      const [gasPrice, initialNonce] = await Promise.all([CryptoAPI.getOpGasPrice(), CryptoAPI.getOpTransactionCount(sender)]);

      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const nonce = initialNonce + i; // Increment nonce for each transaction

        try {
          // Create transaction
          const transaction = {
            to: recipient.address,
            value: ethers.parseEther(recipient.amount),
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce,
            chainId: chainId,
          };

          // Sign transaction
          const wallet = new ethers.Wallet(privateKey);
          const signedTx = await wallet.signTransaction(transaction);

          // Broadcast transaction
          const res = await CryptoAPI.sendOpRawTransaction([signedTx]);
          transactionResults[recipient.address] = res; // Store transaction result

          if (res.success) successfulTransactions.push(recipient.address);
          else failedTransactions.push(recipient.address);
        } catch (err) {
          console.error(`Failed to send transaction to ${recipient.address}:`, err);
          failedTransactions.push(recipient.address);
        }
      }
    } catch (err) {
      console.error("Failed to OP sendTransaction: ", err);
    } finally {
      if (successfulTransactions.length === recipients.length)
        return {
          success: true,
          message: "All transactions broadcasted.",
          data: {
            successfulTransactions,
            failedTransactions,
            transactionResults,
          },
        };
      else
        return {
          success: false,
          error: `Transactions to ${failedTransactions.join(",")} failed.`,
          data: {
            successfulTransactions,
            failedTransactions,
            transactionResults,
          },
        };
    }
  }
}

export default Optimism;
