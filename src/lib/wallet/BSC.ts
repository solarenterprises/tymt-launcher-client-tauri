import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import axios from "axios";

import { CONFIG_BSC_API_KEY, CONFIG_BSC_API_URL, CONFIG_NETWORK_NAME } from "../../config/MainConfig";

import { ISupportToken } from "../../types/ChainTypes";
import { IBalance } from "../../types/WalletTypes";
import { IRecipient } from "../../types/TransactionTypes";
import { CryptoAPI } from "../api/CryptoAPI";
import { CONST_CHAIN_IDS } from "../../const/ChainConsts";

export class BSC {
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
    const wallet = await BSC.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      const response = await axios.get(`${CONFIG_BSC_API_URL}`, {
        params: {
          module: "account",
          action: "balance",
          address: addr,
          apikey: CONFIG_BSC_API_KEY,
        },
      });
      const result = response.data.result;
      return parseFloat(result) / 1e18; // Convert from Wei to BNB
    } catch (err) {
      console.error("Failed to BSC getBalance: ", err);
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
            balance: 0.0,
          });
        } else {
          const response = await axios.get(`${CONFIG_BSC_API_URL}`, {
            params: {
              module: "account",
              action: "tokenbalance",
              contractAddress: tokens[i].address,
              address: addr,
              apikey: CONFIG_BSC_API_KEY,
            },
          });
          const balance = parseFloat(response.data.result) / 10 ** (tokens[i].decimals as number);
          result.push({
            symbol: tokens[i].symbol,
            balance: balance,
          });
        }
      }
      return result;
    } catch (err) {
      console.error("Failed to BSC getTokenBalance: ", err);
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
      const chainId = CONST_CHAIN_IDS.BINANCE; // Binance Smart Chain
      const [gasPrice, initialNonce] = await Promise.all([CryptoAPI.getBscGasPrice(), CryptoAPI.getBscTransactionCount(sender)]);

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
          const res = await CryptoAPI.sendBscRawTransaction([signedTx]);
          transactionResults[recipient.address] = res; // Store transaction result

          if (res.success) successfulTransactions.push(recipient.address);
          else failedTransactions.push(recipient.address);
        } catch (err) {
          console.error(`Failed to send transaction to ${recipient.address}:`, err);
          failedTransactions.push(recipient.address);
        }
      }
    } catch (err) {
      console.error("Failed to BSC sendTransaction: ", err);
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

  // static async getRawTransaction(to: string, amount: string, gasLimit: number, gasPrice: number, nonce: number, chainId: number, privateKey: string) {
  //   const wallet = new ethers.Wallet(privateKey);

  //   const transaction = {
  //     to,
  //     value: ethers.parseEther(amount), // Send 1 BNB if amount = "1"
  //     gasLimit: 20000,
  //     gasPrice: ethers.parseUnits("20", "gwei"),
  //     nonce: await getNonce(), // Ensure you have the correct nonce
  //     chainId: 56, // Binance Smart Chain
  //   };

  //   // Sign the transaction
  //   const signedTx = await wallet.signTransaction(transaction);

  //   console.log("Raw Signed Transaction:", rawTx);
  // }
}

export default BSC;
