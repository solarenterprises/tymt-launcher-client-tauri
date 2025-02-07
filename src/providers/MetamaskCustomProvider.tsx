import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { listen, emit } from "@tauri-apps/api/event";
import { useSDK, MetaMaskSDK } from "@metamask/sdk-react";

import { IRPCRequest } from "../types/APITypes/MetamaskTypes";

interface MetamaskContextType {
  account: string;

  connect: () => Promise<void>;
}

const MetamaskContext = createContext<MetamaskContextType | undefined>(undefined);

export const MetamaskCustomProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string>();
  //@ts-ignore
  const { sdk, connected, connecting, provider, chainId, account: acc } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk.connect();
      console.log(accounts);
      setAccount(accounts?.[0]);
      console.log("acc", acc);
    } catch (err) {
      console.warn("Failed to connect: ", err);
    }
  };

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
