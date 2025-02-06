import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import { validate } from "multicoin-address-validator";
// import * as bs58 from "bs58";

import { CONFIG_NETWORK_NAME } from "../../config/MainConfig";

export class Solana {
  static async getAddress(mnemonic: string): Promise<string> {
    try {
      const keypair = await this.getKeyPair(mnemonic);
      const publicKey = keypair.publicKey.toBase58();
      return publicKey;
    } catch (err) {
      console.error("Failed to Solana.getAddress: ", err);
      return "";
    }
  }

  static validateAddress(addr: string) {
    if (!addr) return false;
    return validate(addr, "sol");
  }

  static async getKeyPair(mnemonic: string): Promise<Keypair> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivationPath = "m/44'/501'/0'/0'";
    const derivedSeed = ed25519.derivePath(derivationPath, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    return keypair;
  }

  // static async getBalance(addr: string): Promise<number> {
  //   try {
  //     if (CONFIG_NETWORK_NAME === "testnet") return 0;
  //     const apiURL = "https://api.mainnet-beta.solana.com";
  //     const pbKey = new PublicKey(addr).toBase58();
  //     const bodyContent = {
  //       jsonrpc: "2.0",
  //       id: 1,
  //       method: "getBalance",
  //       params: [pbKey],
  //     };
  //     const body = JSON.stringify(bodyContent);
  //     const response: any = await tauriFetch(apiURL, {
  //       method: "POST",
  //       connectTimeout: 30,
  //       body: JSON.parse(body),
  //     });
  //     const sols = (await response.json()?.result?.value) / 1e9;
  //     return sols;
  //   } catch (err) {
  //     // console.log("Failed to SOLANA getBalance: ", err);
  //     return 0;
  //   }
  // }

  static async getBalance(addr: string): Promise<number> {
    try {
      if (CONFIG_NETWORK_NAME === "testnet") return 0;
      const apiURL = "https://api.mainnet-beta.solana.com";
      const pbKey = new PublicKey(addr).toBase58();
      const bodyContent = {
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [pbKey],
      };
      const body = JSON.stringify(bodyContent);

      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      const data = await response.json();
      if (data?.result?.value !== undefined) {
        const sols = data.result.value / 1e9; // Convert lamports to SOL
        return sols;
      }

      return 0; // In case of an invalid response
    } catch (err) {
      console.error("Failed to get balance on Solana: ", err);
      return 0;
    }
  }
}

export default Solana;
