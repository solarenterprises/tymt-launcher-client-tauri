import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import axios from "axios";

import { CONFIG_BSC_API_KEY, CONFIG_BSC_API_URL, CONFIG_NETWORK_NAME } from "../../config/MainConfig";

import { ISupportToken } from "../../types/ChainTypes";
import { IBalance } from "../../types/WalletTypes";

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
}

export default BSC;
