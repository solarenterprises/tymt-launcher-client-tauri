import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

import { useMetamask } from "./MetamaskCustomProvider";
import { getAuth } from "../store/AuthSlice";

import { IAuth } from "../types/AccountTypes";

export const AuthProvider = () => {
  const navigate = useNavigate();
  const { disconnect } = useMetamask();

  const authStore: IAuth = useSelector(getAuth);

  useEffect(() => {
    if (!authStore?.accessToken || !authStore?.isLoggedIn) {
      navigate("/");
      disconnect();
    }
  }, [authStore]);

  return (
    <>
      <Outlet />
    </>
  );
};
