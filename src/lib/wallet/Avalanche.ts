import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";

import { CONFIG_AVAX_API_URL, CONFIG_AVAX_RPC_URL, CONFIG_NETWORK_NAME } from "../../config/MainConfig";
import tymtStorage from "../storage/tymtStorage";

import { ISupportToken } from "../../types/ChainTypes";
import { IBalance } from "../../types/WalletTypes";
import { IRecipient } from "../../types/TransactionTypes";
import { CONST_CHAIN_IDS } from "../../const/ChainConsts";
import { CryptoAPI } from "../api/CryptoAPI";

export class Avalanche {
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
    const wallet = await Avalanche.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      const customProvider = new ethers.JsonRpcProvider(CONFIG_AVAX_RPC_URL);
      return parseFloat(ethers.formatEther(await customProvider.getBalance(addr))) / 1e9 / 1e9;
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
            balance: 0.0,
          });
        } else {
          const tokenContractAddress = tokens[i].address;
          const tokenAbi = ["function balanceOf(address owner) view returns (uint256)"];
          const customProvider = new ethers.JsonRpcProvider(CONFIG_AVAX_RPC_URL);
          const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, customProvider);
          result.push({
            symbol: tokens[i].symbol,
            balance: parseFloat(await tokenContract.balanceOf(addr)) / 10 ** (tokens[i].decimals as number),
          });
        }
      }
      return result;
    } catch (err) {
      // console.log("Failed to AVALANCHE getTokenBalance: ", err);
      return [];
    }
  }

  static async getTransactions(addr: string, page: number): Promise<any> {
    if (page === 1) {
      let endpoint = "";
      tymtStorage.set(`avaxNextToken`, "");
      if (CONFIG_NETWORK_NAME === "mainnet") {
        endpoint = `${CONFIG_AVAX_API_URL}/address/${addr}/erc20-transfers?limit=15`;
      } else {
        endpoint = `${CONFIG_AVAX_API_URL}/address/${addr}/transactions?&limit=15`;
      }
      try {
        const res = await (await fetch(endpoint)).json();
        const nextToken: string = res.link.nextToken;
        tymtStorage.set(`avaxNextToken`, nextToken);
        return res.items;
      } catch (error) {
        // console.error("Error fetching transactions:", error);
        return [];
      }
    } else {
      const nextToken = tymtStorage.get(`avaxNextToken`);
      let endpoint = `${CONFIG_AVAX_API_URL}/address/${addr}/erc20-transfers?limit=15&next=${nextToken}`;
      try {
        const res = await (await fetch(endpoint)).json();
        const nextToken: string = res.link.nextToken;
        tymtStorage.set(`avaxNextToken`, nextToken);
        return res.items;
      } catch (error) {
        // console.error("Error fetching transactions:", error);
        return [];
      }
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
      const chainId = CONST_CHAIN_IDS.AVALANCHE; // Binance Smart Chain
      const [gasPrice, initialNonce] = await Promise.all([CryptoAPI.getAvaxGasPrice(), CryptoAPI.getAvaxTransactionCount(sender)]);

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
          const res = await CryptoAPI.sendAvaxRawTransaction([signedTx]);
          transactionResults[recipient.address] = res; // Store transaction result

          if (res.success) successfulTransactions.push(recipient.address);
          else failedTransactions.push(recipient.address);
        } catch (err) {
          console.error(`Failed to send transaction to ${recipient.address}:`, err);
          failedTransactions.push(recipient.address);
        }
      }
    } catch (err) {
      console.error("Failed to AVAX sendTransaction: ", err);
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

export default Avalanche;
