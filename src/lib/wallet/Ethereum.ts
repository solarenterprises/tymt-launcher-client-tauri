import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { validate } from "multicoin-address-validator";
import axios from "axios";

import { CONFIG_ETH_API_URL, CONFIG_ETH_API_KEY, CONFIG_NETWORK_NAME } from "../../config/MainConfig";

import { ISupportToken } from "../../types/ChainTypes";
import { IBalance } from "../../types/WalletTypes";
import { IRecipient } from "../../types/TransactionTypes";
import { CONST_CHAIN_IDS } from "../../const/ChainConsts";
import { CryptoAPI } from "../api/CryptoAPI";

export class Ethereum {
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

  static async getPrivateKey(mnemonic: string): Promise<string> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdNode = ethereumjsWallet.hdkey.fromMasterSeed(seed);
    const node = hdNode.derivePath(`m/44'/60'/0'`);
    const change = node.deriveChild(0);
    const childNode = change.deriveChild(0);
    const childWallet = childNode.getWallet();
    const privateKey = childWallet.getPrivateKey().toString("hex");
    return privateKey;
  }

  static async getAddress(mnemonic: string): Promise<string> {
    const wallet = await Ethereum.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static validateAddress(addr: string) {
    if (!addr) return false;
    return validate(addr, "eth");
  }

  static async signMessage(message: string, passphrase: string): Promise<string> {
    try {
      const wallet = await Ethereum.getWalletFromMnemonic(passphrase);
      const signature = await wallet.signMessage(message);
      return signature;
    } catch (err) {
      console.error("Failed Ethereum signMessage: ", err);
      throw err;
    }
  }

  static async verifyMessage(message: string, signature: string, address: string): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress === address;
    } catch (err) {
      console.error("Failed Ethereum verifyMessage: ", err);
      return false;
    }
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      const response = await axios.get(`${CONFIG_ETH_API_URL}`, {
        params: {
          module: "account",
          action: "balance",
          address: addr,
          tag: "latest",
          apikey: CONFIG_ETH_API_KEY,
        },
      });
      const result = response.data.result;
      return parseFloat(result) / 1e18; // Convert from Wei to ETH
    } catch (err) {
      console.error("Failed Ethereum getBalance: ", err);
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
          const response = await axios.get(`${CONFIG_ETH_API_URL}`, {
            params: {
              module: "account",
              action: "tokenbalance",
              contractaddress: tokens[i].address,
              address: addr,
              tag: "latest",
              apikey: CONFIG_ETH_API_KEY,
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
      console.error("Failed to ETHEREUM getTokenBalance: ", err);
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
      const chainId = CONST_CHAIN_IDS.ETHEREUM;
      const [gasPrice, initialNonce] = await Promise.all([CryptoAPI.getEthGasPrice(), CryptoAPI.getEthTransactionCount(sender)]);

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
          const res = await CryptoAPI.sendEthRawTransaction([signedTx]);
          transactionResults[recipient.address] = res; // Store transaction result

          if (res.success) successfulTransactions.push(recipient.address);
          else failedTransactions.push(recipient.address);
        } catch (err) {
          console.error(`Failed to send transaction to ${recipient.address}:`, err);
          failedTransactions.push(recipient.address);
        }
      }
    } catch (err) {
      console.error("Failed to ETH sendTransaction: ", err);
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

export default Ethereum;
