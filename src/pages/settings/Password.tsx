import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Divider, Stack } from "@mui/material";

import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";
import InputText from "../../components/account/InputText";
import SecurityLevel from "../../components/account/SecurityLevel";

import { getAccount, setAccount } from "../../store/AccountSlice";

import { useNotification } from "../../providers/NotificationProvider";
import { encrypt, decrypt, getKeccak256Hash } from "../../lib/helper/EncryptHelper";

import { IAccount } from "../../types/AccountTypes";
import { addAccountList } from "../../store/AccountListSlice";

import backIcon from "../../assets/setting/BackIcon.svg";

export interface IPropsPassword {
  view: string;
  setView: (_: string) => void;
}

const Password = ({ view, setView }: IPropsPassword) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const dispatch = useDispatch();

  const accountStore: IAccount = useSelector(getAccount);

  const [newPwd, setNewPwd] = useState("");
  const [oldPwd, setOldPwd] = useState("");
  const [cfmPwd, setCfmPwd] = useState("");

  const resetFields = () => {
    setNewPwd("");
    setOldPwd("");
    setCfmPwd("");
  };

  const updatePassword = useCallback(async () => {
    try {
      const oldPwdHash = getKeccak256Hash(oldPwd);
      const newPwdHash = getKeccak256Hash(newPwd);

      if (accountStore?.password !== oldPwdHash || oldPwd === "") {
        resetFields();
        return;
      }
      if (accountStore?.password === newPwdHash || newPwd === "") {
        resetFields();
        return;
      }

      if (cfmPwd !== newPwd || cfmPwd === "") {
        resetFields();
        return;
      }

      const decryptedMnemonic = await decrypt(accountStore?.mnemonic, oldPwd);
      const encryptedMnemonic = await encrypt(decryptedMnemonic, newPwd);

      const newAccountStore = {
        ...accountStore,
        password: newPwdHash,
        mnemonic: encryptedMnemonic,
      };

      dispatch(setAccount(newAccountStore));
      dispatch(addAccountList(newAccountStore));
      resetFields();
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.PROFILE_UPDATE_SUCCESS });
    } catch (err) {
      console.error("Error updating password:", err);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.PROFILE_UPDATE_FAIL, text: err.toString() });
      resetFields();
    }
  }, [accountStore, newPwd, oldPwd, cfmPwd]);

  return (
    <>
      {view === "password" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("security")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-71_change-password")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"center"} gap={"20px"} padding={"20px"}>
              <Box className="fs-h4 white">
                <InputText id="old-password" label={t("set-74_your-old-password")} type="password" value={oldPwd} setValue={setOldPwd} />
              </Box>
              <Box className="fs-h4 white">
                <InputText id="new-password" label={t("set-75_your-new-password")} type="password" value={newPwd} setValue={setNewPwd} />
              </Box>
              <Box>
                <SecurityLevel password={newPwd} />
              </Box>
              <Box className="fs-h4 white">
                <InputText id="confirm-password" label={t("set-77_confirm-your-password")} type="password" value={cfmPwd} setValue={setCfmPwd} />
              </Box>
            </Stack>
            <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
              <Button
                fullWidth
                sx={{
                  "&.MuiButtonBase-root": {
                    textTransform: "none",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "24px" /* 133.333% */,
                    letterSpacing: "-0.36px",
                    height: "46px",
                    borderRadius: "16px",
                    backgroundColor: "transparent",
                    color: "#52E1F2",
                    borderColor: "#EF4444",
                    fontFamily: "Cobe",
                    boxShadow: "none",
                    border: "1px solid",
                    paddingTop: "5px",
                    "&:hover": {
                      borderColor: "#EF4444",
                      backgroundColor: "#EF4444",
                    },
                    "&:active": {
                      backgroundColor: "#EF4444",
                      boxShadow: "1px 1px #EF44445F",
                    },
                    "&:disabled": {
                      backgroundColor: "#222222", // Example: light gray background
                      color: "#A0A0A0", // Example: gray text color
                      borderColor: "#222222", // Example: gray border color
                    },
                  },
                }}
                onClick={updatePassword}
              >
                {t("set-57_save")}
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Password;
