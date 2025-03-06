import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Box, Stack } from "@mui/material";

import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";

import { useNotification } from "../../providers/NotificationProvider";
import { useWallet } from "../../providers/WalletProvider";

import AccountNextButton from "./AccountNextButton";
import InputText from "./InputText";

import { getAccount, setAccount } from "../../store/AccountSlice";
import { setAuth } from "../../store/AuthSlice";
import { addAccountList } from "../../store/AccountListSlice";
import { setWallet } from "../../store/WalletSlice";
import { setMnemonic } from "../../store/MnemonicSlice";

import { AuthAPI } from "../../lib/api/AuthAPI";
import { decrypt, encrypt, getKeccak256Hash } from "../../lib/helper/EncryptHelper";
import { getWalletAddressesFromPassphrase } from "../../lib/helper/WalletHelper";

import { IAccount } from "../../types/AccountTypes";
import { IWalletAddresses } from "../../types/WalletTypes";

const LoginAccountForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const { handleRefreshClick } = useWallet();

  const accountStore: IAccount = useSelector(getAccount);
  const accountStoreRef = useRef(accountStore);
  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);

  const [loading, setLoading] = useState<boolean>(false);

  const isGuest: boolean = useMemo(() => {
    if (accountStore?.nickname === "Guest" && accountStore?.password === getKeccak256Hash("")) return true;
    return false;
  }, [accountStore]);

  const handleGuestLogin = useCallback(async () => {
    try {
      const password = "";
      const decryptedMnemonic = await decrypt(accountStoreRef?.current?.mnemonic, password);
      const walletAddresses = await getWalletAddressesFromPassphrase(decryptedMnemonic);
      navigate("/confirm-information/login", {
        state: {
          password: password,
          walletAddresses: walletAddresses,
          nickname: "Guest",
          passphrase: decryptedMnemonic,
        },
      });
    } catch (err) {
      console.error("Failed to handleGuestLogin: ", err);
    }
  }, [accountStore]);

  const handleLogin = async (walletAddresses: IWalletAddresses, passphrase: string, password: string) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .test("equals", t("cca-60_wrong-password"), (value) => {
          return getKeccak256Hash(value) === accountStoreRef?.current?.password;
        })
        .test("password-requirements", t("cca-66_password-must-be"), (value) => {
          if (!value) {
            return false;
          }
          const checks = [
            /[a-z]/.test(value), // Check for lowercase letter
            /[A-Z]/.test(value), // Check for uppercase letter
            /\d/.test(value), // Check for digit
            /^[^\s'";\\]+$/.test(value), // Exclude spaces, single quotes, double quotes, semicolons, and backslashes
            value.length >= 8, // Check for minimum length
          ];
          const passedConditions = checks.filter(Boolean).length;
          return passedConditions >= 4;
        })
        .required(t("cca-63_required")),
    }),
    onSubmit: async () => {
      try {
        const password = formik.values.password;
        const decryptedMnemonic = await decrypt(accountStoreRef?.current?.mnemonic, password);
        const walletAddresses = await getWalletAddressesFromPassphrase(decryptedMnemonic);

        await handleLogin(walletAddresses, decryptedMnemonic, password);

        // navigate("/confirm-information/login", {
        //   state: {
        //     password: password,
        //     walletAddresses: walletAddresses,
        //     nickname: accountStoreRef?.current?.nickname,
        //     passphrase: decryptedMnemonic,
        //   },
        // });
      } catch (err) {
        console.error("Failed to onSubmit at LoginAccountForm:  ", err);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={"24px"}>
          {!isGuest && (
            <>
              <Stack>
                <InputText
                  id="password"
                  label={t("ncca-3_password")}
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && formik.errors.password ? true : false}
                />
                {formik.touched.password && formik.errors.password && <Box className={"fs-16-regular red"}>{formik.errors.password}</Box>}
              </Stack>
              <AccountNextButton
                isSubmit={true}
                text={t("ncca-7_next")}
                disabled={(formik.touched.password && formik.errors.password) || loading ? true : false}
                loading={loading}
              />
            </>
          )}
          {isGuest && <AccountNextButton text={t("ncca-7_next")} onClick={handleGuestLogin} loading={loading} disabled={loading} />}
        </Stack>
      </form>
    </>
  );
};

export default LoginAccountForm;
