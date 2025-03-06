import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Provider as StoreProvider } from "react-redux";
import ReactDOM from "react-dom/client";
import { MetaMaskProvider } from "@metamask/sdk-react";

import store from "./store";

import "./locale/i18n";
import "./styles/app.scss";
import "./index.css";

// Layout
import HomeLayout from "./layouts/HomeLayout";
// ~Layout

// Auth
import Splash from "./pages/welcome/Splash";
import Welcome from "./pages/welcome/Welcome";
import NonCustodialLogin1 from "./pages/account/non-custodial/NonCustodialLogin1";
import NonCustodialLogIn2 from "./pages/account/non-custodial/NonCustodialLogIn2";
import NonCustodialSignUp2 from "./pages/account/non-custodial/NonCustodialSignUp2";
import NonCustodialSignUp3 from "./pages/account/non-custodial/NonCustodialSignUp3";
import NonCustodialSignUp4 from "./pages/account/non-custodial/NonCustodialSignUp4";
import NonCustodialImport1 from "./pages/account/non-custodial/NonCustodialImport1";
import ConfirmInformation from "./pages/account/ConfirmInformation";
// ~Auth

// Home
import Homepage from "./pages/main/Homepage";
import GameOverview from "./pages/main/GameOverview";
// ~Home

//Store
import Store from "./pages/main/Store";
import Library from "./pages/main/Library";
import DeveloperStore from "./pages/main/DeveloperStore";
import DeveloperGameOverview from "./pages/main/DeveloperGameOverview";
//~Store

//Wallet
import Wallet from "./pages/wallet/Wallet";
import WalletVote from "./pages/wallet/WalletVote";
import WalletSend from "./pages/wallet/WalletSend";
//~Wallet

// Providers
import { FullscreenProvider } from "./providers/FullscreenProvider";
import { WalletProvider } from "./providers/WalletProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { MetamaskCustomProvider } from "./providers/MetamaskCustomProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
// ~Providers

import { Buffer } from "buffer";
import EventListenerProvider from "./providers/EventListenerProvider";

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          logging: {
            developerMode: false,
          },
          // communicationServerUrl: process.env.REACT_APP_COMM_SERVER_URL,
          checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
          dappMetadata: {
            name: "tymt-launcher",
            // url: window.location.host,
          },
        }}
      >
        <FullscreenProvider>
          <WalletProvider>
            <MetamaskCustomProvider>
              <HashRouter>
                <Routes>
                  <Route element={<NotificationProvider />}>
                    <Route element={<EventListenerProvider />}>
                      <Route path="/" element={<Splash />} />
                      <Route path="/welcome" element={<Welcome />} />
                      <Route path="/non-custodial-login-1" element={<NonCustodialLogin1 />} />
                      <Route path="/non-custodial-login-2" element={<NonCustodialLogIn2 />} />
                      <Route path="/non-custodial-signup-2" element={<NonCustodialSignUp2 />} />
                      <Route path="/non-custodial-signup-3" element={<NonCustodialSignUp3 />} />
                      <Route path="/non-custodial-signup-4/:mode" element={<NonCustodialSignUp4 />} />
                      <Route path="/non-custodial-import-1/:mode" element={<NonCustodialImport1 />} />
                      <Route path="/confirm-information/:mode" element={<ConfirmInformation />} />
                      <Route element={<AuthProvider />}>
                        <Route path="/" element={<HomeLayout />}>
                          <Route path="/home" element={<Homepage />} />
                          <Route path="/game/:gameId" element={<GameOverview />} />
                          <Route path="/wallet" element={<Wallet />} />
                          <Route path="/wallet-vote" element={<WalletVote />} />
                          <Route path="/wallet-send" element={<WalletSend />} />
                          <Route path="/store" element={<Store />} />
                          <Route path="/library" element={<Library />} />
                          <Route path="/developer-store" element={<DeveloperStore />} />
                          <Route path="/developer-store/:gameId" element={<DeveloperGameOverview />} />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Routes>
              </HashRouter>
            </MetamaskCustomProvider>
          </WalletProvider>
        </FullscreenProvider>
      </MetaMaskProvider>
    </StoreProvider>
  </React.StrictMode>
);
