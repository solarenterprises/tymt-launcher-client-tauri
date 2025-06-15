import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

import { useMetamask } from "./MetamaskCustomProvider";
import { getAuth } from "../store/AuthSlice";
import { resetBetaModalState } from "../store/BetaModalSlice";

import { IAuth } from "../types/AccountTypes";

export const AuthProvider = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { disconnect } = useMetamask();

  const authStore: IAuth = useSelector(getAuth);

  useEffect(() => {
    if (!authStore?.accessToken || !authStore?.isLoggedIn) {
      navigate("/");
      disconnect();
    } else {
      dispatch(resetBetaModalState());
    }
  }, [authStore]);

  return (
    <>
      <Outlet />
    </>
  );
};