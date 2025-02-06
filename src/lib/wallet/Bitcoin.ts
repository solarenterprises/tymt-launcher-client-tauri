import { mnemonicToSeed } from "bip39";
import { BIP32Factory } from "bip32";
import { payments, networks } from "bitcoinjs-lib";
import axios from "axios";
import { validate } from "bitcoin-address-validation";
import * as ecc from "tiny-secp256k1";

import { CONFIG_BTC_API_URL, CONFIG_NETWORK_NAME } from "../../config/MainConfig";

export class Bitcoin {
  static async getKeyPair(mnemonic: string): Promise<any> {
    const seed = await mnemonicToSeed(mnemonic);
    //@ts-ignore
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed);
    let child;
    if (CONFIG_NETWORK_NAME === "testnet") {
      child = root.derivePath("m/44'/1'/0'/0/0");
      const privateKey = child.privateKey;
      if (!privateKey) {
        throw new Error("Failed to obtain private key");
      }
      const keyPair = bip32.fromPrivateKey(privateKey, child.chainCode, networks.testnet);
      return keyPair;
    } else {
      child = root.derivePath("m/84'/0'/0'/0/0");
      const privateKey = child.privateKey;
      if (!privateKey) {
        throw new Error("Failed to obtain private key");
      }
      const keyPair = bip32.fromPrivateKey(privateKey, child.chainCode, networks.bitcoin);
      return keyPair;
    }
  }

  static async getAddress(mnemonic: string): Promise<string> {
    const keyPair = await Bitcoin.getKeyPair(mnemonic.normalize("NFD"));
    if (CONFIG_NETWORK_NAME === "testnet") {
      const { address } = payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: networks.testnet,
      });
      return address ?? "";
    } else {
      const { address } = payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: networks.bitcoin,
      });
      return address ?? "";
    }
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      if (CONFIG_NETWORK_NAME === "mainnet") {
        const result = await axios.get(`${CONFIG_BTC_API_URL}/q/addressbalance/${addr}`);
        if (result.status === 200) {
          const balance = parseFloat(result.data);
          const bitcoins = balance / 1e8;
          return bitcoins;
        } else {
          return 0;
        }
      } else {
        const result = await axios.get(`${CONFIG_BTC_API_URL}/address/${addr}`);
        if (result.status === 200) {
          const balance = result.data.chain_stats.funded_txo_sum;
          const bitcoins = balance / 1e8;
          return bitcoins;
        } else {
          return 0;
        }
      }
    } catch (err) {
      console.error("Failed to Bitcoin getBalance: ", err);
      return 0;
    }
  }

  // static async getTransactions(addr: string, page: number): Promise<any> {
  //   try {
  //     if (CONFIG_NETWORK_NAME === "mainnet") {
  //       const apiURL = `${CONFIG_BTC_API_URL}/rawaddr/${addr}?offset=${(page - 1) * 15}limit=15`;
  //       let response: any = await tauriFetch(apiURL, {
  //         method: "GET",
  //         connectTimeout: 30,
  //       });
  //       response = await response.json();
  //       if (!response) return [];
  //       if (response.status === 429) {
  //         // console.error("Failed to get BTC transactions: 429 error");
  //         return [];
  //       }
  //       if (response?.data?.txs) return response?.data?.txs;
  //       // console.error("Failed to get BTC transactions: unknown error");
  //       return [];
  //     } else {
  //       const txs = await (await fetch(`${CONFIG_BTC_API_URL}/address/${addr}/txs?limit=10`)).json();
  //       return txs;
  //     }
  //   } catch {
  //     return [];
  //   }
  // }

  static validateAddress(address: string) {
    if (!address) return false;
    return validate(address);
  }
}

export default Bitcoin;
