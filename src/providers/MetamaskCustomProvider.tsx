import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { listen, emit } from "@tauri-apps/api/event";
import { useSDK } from "@metamask/sdk-react";

import { getWallet } from "../store/WalletSlice";

import { IRPCRequest } from "../types/APITypes/MetamaskTypes";
import { IWalletAddresses } from "../types/WalletTypes";
import MetamaskImportModal from "../components/modal/MetamaskImportModal";

interface MetamaskContextType {
  account: string;

  connect: () => Promise<void>;
}

const MetamaskContext = createContext<MetamaskContextType | undefined>(undefined);

export const MetamaskCustomProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string>();
  const [openMetamaskImportModal, setOpenMetamaskImportModal] = useState<boolean>(false);
  // const [openMetamaskWarningModal, setOpenMetamaskWarningModal] = useState<boolean>(false);

  const { sdk, connected } = useSDK();

  const walletStore: IWalletAddresses = useSelector(getWallet);

  const ethWalletAddress = useMemo(() => walletStore?.ethereum, [walletStore]);

  const connect = useCallback(async () => {
    try {
      if (connected) return;
      const accounts = await sdk?.connect();
      if (ethWalletAddress.toLocaleLowerCase() !== accounts?.[0]?.toLocaleLowerCase()) {
        sdk?.disconnect();
        setOpenMetamaskImportModal(true);
      } else {
        setAccount(accounts?.[0]);
      }
    } catch (err) {
      console.error("Failed to connect: ", err);
    }
  }, [ethWalletAddress, sdk]);

  useEffect(() => {
    const unlisten_rpc = listen("POST-/rpc_request", async (event) => {
      try {
        const data = JSON.parse(event.payload as string) as IRPCRequest;
        const res = await sdk.connectWith(data.request);
        emit("res-POST-/rpc_request", res);
      } catch (err) {
        emit("res-POST-/rpc_request", { message: err.message ? err.message : "Unknown Error" });
      }
    });

    return () => {
      unlisten_rpc.then((unlistenFn) => unlistenFn());
    };
  });

  return (
    <MetamaskContext.Provider
      value={{
        account,
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
