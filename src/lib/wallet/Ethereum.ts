import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { validate } from "multicoin-address-validator";
import axios from "axios";

import { CONFIG_ETH_API_URL, CONFIG_ETH_API_KEY, CONFIG_NETWORK_NAME } from "../../config/MainConfig";

import { ISupportToken } from "../../types/ChainTypes";
import { IBalance } from "../../types/WalletTypes";

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
}

export default Ethereum;
