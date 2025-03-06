import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { listen, emit } from "@tauri-apps/api/event";
import { useSDK } from "@metamask/sdk-react";

import { getWallet } from "../store/WalletSlice";

import { IRPCRequest } from "../types/APITypes/MetamaskTypes";
import { IWalletAddresses } from "../types/WalletTypes";
import MetamaskImportModal from "../components/modal/MetamaskImportModal";
import {
  CONST_CHAIN_BLOCK_EXPLORER,
  CONST_CHAIN_HEX_IDS,
  CONST_CHAIN_ID_TO_NAME,
  CONST_CHAIN_NAMES,
  CONST_CHAIN_NATIVE_CURRENCY,
  CONST_CHAIN_RPC_URLS,
} from "../const/ChainConsts";

interface MetamaskContextType {
  connect: () => Promise<void>;
}

const MetamaskContext = createContext<MetamaskContextType | undefined>(undefined);

export const MetamaskCustomProvider = ({ children }: { children: ReactNode }) => {
  const [openMetamaskImportModal, setOpenMetamaskImportModal] = useState<boolean>(false);
  // const [openMetamaskWarningModal, setOpenMetamaskWarningModal] = useState<boolean>(false);

  const { sdk, connected, chainId } = useSDK();

  const walletStore: IWalletAddresses = useSelector(getWallet);

  const ethWalletAddress = useMemo(() => walletStore?.ethereum, [walletStore]);

  const connect = useCallback(async () => {
    try {
      if (connected) return;
      const accounts = await sdk?.connect();
      if (ethWalletAddress.toLocaleLowerCase() !== accounts?.[0]?.toLocaleLowerCase()) {
        sdk?.disconnect();
        setOpenMetamaskImportModal(true);
      }
    } catch (err) {
      console.error("Failed to connect: ", err);
    }
  }, [ethWalletAddress, sdk]);

  const changeNetwork = async (chainId: string) => {
    try {
      const chainString: string = CONST_CHAIN_ID_TO_NAME.get(chainId);
      const chainIdHex = CONST_CHAIN_HEX_IDS[chainString];
      await sdk?.connectWith({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // If the network is not added, prompt to add it
        const chainString: string = CONST_CHAIN_ID_TO_NAME.get(chainId);
        const chainIdHex = CONST_CHAIN_HEX_IDS[chainString];
        const chainName = CONST_CHAIN_NAMES[chainString];
        const chainRPCUrl = CONST_CHAIN_RPC_URLS[chainString];
        const chainBlockExploreUrl = CONST_CHAIN_BLOCK_EXPLORER[chainString];
        const chainNativeCurrency = CONST_CHAIN_NATIVE_CURRENCY[chainString];
        try {
          await sdk?.connectWith({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: chainName,
                rpcUrls: [chainRPCUrl],
                nativeCurrency: chainNativeCurrency,
                blockExplorerUrls: [chainBlockExploreUrl],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError.message);
          throw new Error(`Failed to add network: ${addError.message}`);
        }
      } else {
        console.error("Failed to switch network:", error.message);
        throw new Error(`Failed to switch network: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    const unlisten_rpc = listen("POST-/rpc_request", async (event) => {
      try {
        const data = JSON.parse(event.payload as string) as IRPCRequest;
        const chainIdParam = data.chain?.chainId;
        if (chainIdParam !== chainId) {
          await changeNetwork(chainIdParam);
        }
        const res = await sdk?.connectWith(data.request);
        emit("res-POST-/rpc_request", res);
      } catch (err) {
        emit("res-POST-/rpc_request", { message: err.message ? err.message : "Unknown Error" });
      }
    });

    return () => {
      unlisten_rpc.then((unlistenFn) => unlistenFn());
    };
  }, [chainId]);

  return (
    <MetamaskContext.Provider
      value={{
        connect,
      }}
    >
      {children}
      <MetamaskImportModal open={openMetamaskImportModal} setOpen={setOpenMetamaskImportModal} />
    </MetamaskContext.Provider>
  );
};

export const useMetamask = (): MetamaskContextType => {
  const context = useContext(MetamaskContext);
  if (!context) {
    throw new Error("useMetamask must be used within a MetamaskCustomProvider");
  }
  return context;
};
