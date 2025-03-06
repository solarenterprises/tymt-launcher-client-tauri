import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { listen } from "@tauri-apps/api/event";
import { openLink } from "../lib/helper/TauriHelper";
import { IAuth } from "../types/AccountTypes";
import { useSelector } from "react-redux";
import { getAuth } from "../store/AuthSlice";

const EventListenerProvider = () => {
  const navigate = useNavigate();

  const authStore: IAuth = useSelector(getAuth);
  const authStoreRef = useRef(authStore);
  useEffect(() => {
    authStoreRef.current = authStore;
  }, [authStore]);

  useEffect(() => {
    const unlisten_about_tymt = listen("about-tymt", () => {
      openLink("https://tymt.com/");
    });

    const unlisten_wallet = listen("wallet", () => {
      if (!authStoreRef?.current?.isLoggedIn) {
        navigate("/");
        return;
      }
      navigate("/wallet");
    });

    const unlisten_game = listen("games", () => {
      if (!authStoreRef?.current?.isLoggedIn) {
        navigate("/");
        return;
      }
      navigate("/store");
    });

    const unlisten_signout = listen("signout", () => {
      navigate("/");
    });

    return () => {
      unlisten_about_tymt.then((unlistenFn) => unlistenFn());
      unlisten_wallet.then((unlistenFn) => unlistenFn());
      unlisten_game.then((unlistenFn) => unlistenFn());
      unlisten_signout.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default EventListenerProvider;
