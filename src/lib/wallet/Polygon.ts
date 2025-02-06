import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";

import { CONFIG_POL_API_KEY, CONFIG_POL_API_URL, CONFIG_NETWORK_NAME } from "../../config/MainConfig";

import { ISupportToken } from "../../types/ChainTypes";
import { IBalance } from "../../types/WalletTypes";

export class Polygon {
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
    const wallet = await Polygon.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      if (CONFIG_NETWORK_NAME === "testnet") return 0;
      const result = (await (await fetch(`${CONFIG_POL_API_URL}?module=account&action=balance&address=${addr}&apikey=${CONFIG_POL_API_KEY}`)).json()).result;
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
                    `${CONFIG_POL_API_URL}?module=account&action=tokenbalance&contractAddress=${tokens[i].address}&address=${addr}&apikey=${CONFIG_POL_API_KEY}`
                  )
                ).json()
              ).result as number) /
              10 ** (tokens[i].decimals as number),
          });
        }
      }
      return result;
    } catch (err) {
      console.error("Failed to POLYGON getTokenBalance: ", err);
      return [];
    }
  }
}

export default Polygon;
