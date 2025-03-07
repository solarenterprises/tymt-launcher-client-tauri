import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Grid, Box, Stack } from "@mui/material";

import Back from "../../components/account/Back";
import AccountHeader from "../../components/account/AccountHeader";
import AccountNextButton from "../../components/account/AccountNextButton";
import Stepper from "../../components/account/Stepper";
import WalletList from "../../components/account/WalletList";

import { useNotification } from "../../providers/NotificationProvider";

import { getAccount, setAccount } from "../../store/AccountSlice";
import { addAccountList, getAccountList } from "../../store/AccountListSlice";
import { setWallet } from "../../store/WalletSlice";
import { setMnemonic } from "../../store/MnemonicSlice";
import { setAuth } from "../../store/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../store";

import { getKeccak256Hash, encrypt } from "../../lib/helper/EncryptHelper";
import { AuthAPI } from "../../lib/api/AuthAPI";

import { IWalletAddresses } from "../../types/WalletTypes";
import { IAccount, IAccountList } from "../../types/AccountTypes";

import tymt2 from "../../assets/account/tymt2.png";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";
import { useWallet } from "../../providers/WalletProvider";
import { UserAPI } from "../../lib/api/UserAPI";
import { useSelector } from "react-redux";

export interface ILocationStateConfirmInformation {
  passphrase: string;
  password: string;
  nickname: string;
  walletAddresses: IWalletAddresses;
}

const ConfirmInformation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { mode } = useParams();
  const { showNotification } = useNotification();
  const { handleRefreshClick } = useWallet();

  const { passphrase, password, nickname, walletAddresses } = (location.state as ILocationStateConfirmInformation) || {};

  const accountListStore: IAccountList = useAppSelector(getAccountList);
  const accountStore: IAccount = useSelector(getAccount);
  const accountStoreRef = useRef(accountStore);
  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);

  const [loading, setLoading] = useState<boolean>(false);

  const handleBackClick = useCallback(() => {
    accountListStore?.list?.length ? navigate("/non-custodial-login-1") : navigate("/welcome");
  }, [accountListStore]);

  const handleSignUp = async () => {
    try {
      await AuthAPI.signup({ nickname, sxpAddress: walletAddresses.solar, passphrase });
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.SIGNUP_SUCCESS });
    } catch (error) {
      console.error("Failed to handleSignUp: ", error);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.SIGNUP_FAIL, text: error.toString() });
    }
  };

  const handleGuestComplete = async () => {
    try {
      const newAccount: IAccount = {
        uid: "",
        avatar: "",
        nickname: nickname,
        password: getKeccak256Hash(password),
        mnemonic: await encrypt(passphrase, password),
        sxpAddress: walletAddresses.solar,
        publicKey: "",
        notificationStatus: false,
        onlineStatus: false,
        status: 0,
      };
      dispatch(addAccountList(newAccount));
    } catch (err) {
      console.error("Failed to handleGuestComplete: ", err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await AuthAPI.login({ sxpAddress: walletAddresses.solar, passphrase });
      dispatch(
        setAuth({
          isLoggedIn: true,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );
      const newAccount: IAccount = {
        uid: res.user?._id,
        avatar: res.user?.avatar,
        nickname: res.user?.nickname,
        password: getKeccak256Hash(password),
        mnemonic: await encrypt(passphrase, password),
        sxpAddress: res.user?.sxpAddress,
        publicKey: res.user?.publicKey,
        notificationStatus: res.user?.notificationStatus,
        onlineStatus: res.user?.onlineStatus,
        status: res.user?.status,
      };
      dispatch(setAccount(newAccount));
      dispatch(addAccountList(newAccount));
      dispatch(setWallet(walletAddresses));
      dispatch(setMnemonic(passphrase));
      navigate("/home");
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.LOGIN_SUCCESS });

      handleRefreshClick();
    } catch (err) {
      console.error("Failed to handleLogin: ", err);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.LOGIN_FAIL, text: err.toString() });
    }
  };

  const handleConfirmClick = async () => {
    setLoading(true);
    if (mode === "signup") await handleSignUp();
    else if (mode === "guest") await handleGuestComplete();
    await handleLogin();
    if (mode === "guest") {
      const updatedUser = await UserAPI.updateProfile({ nickname });
      const updatedAccount = {
        ...updatedUser,
        password: accountStoreRef?.current?.password,
        mnemonic: accountStoreRef?.current?.mnemonic,
      };
      dispatch(setAccount(updatedAccount));
      dispatch(addAccountList(updatedAccount));
    }
    setLoading(false);
  };

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              alignSelf: "center",
            }}
          >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
              <Stack alignItems={"center"} justifyContent={"center"}>
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    container
                    sx={{
                      width: "520px",
                      padding: "10px 0px",
                    }}
                  >
                    <Grid item xs={12} container justifyContent={"space-between"}>
                      <Back onClick={handleBackClick} />
                      <Stepper all={0} now={0} text={t("ncca-48_almost-done-confirm")} />
                    </Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-49_confirm-information")} text={t("ncca-50_welcome-to-kingdom")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <WalletList wallet={walletAddresses} />
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <AccountNextButton text={t("ncca-51_confirm")} onClick={handleConfirmClick} disabled={loading} loading={loading} />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt2}
                sx={{
                  height: "calc(100vh - 64px)",
                }}
              />
            </Stack>
          </motion.div>
        </Grid>
      </Grid>
    </>
  );
};

export default ConfirmInformation;
