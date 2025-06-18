import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Divider, Stack } from "@mui/material";

import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";
import InputText from "../../components/account/InputText";
import CreateAccountForm from "../../components/account/CreateAccountForm";

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

  const [oldPwd, setOldPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = useCallback(async (values: { password: string; passwordMatch?: string }) => {
    try {
      setLoading(true);
      const oldPwdHash = getKeccak256Hash(oldPwd);
      const newPwdHash = getKeccak256Hash(values.password);

      if (accountStore?.password !== oldPwdHash || oldPwd === "") {
        showNotification({ content: CONST_NOTIFICATION_CONTENTS.PROFILE_UPDATE_FAIL, text: "Old password is incorrect" });
        return;
      }
      if (accountStore?.password === newPwdHash || values.password === "") {
        showNotification({ content: CONST_NOTIFICATION_CONTENTS.PROFILE_UPDATE_FAIL, text: "New password must be different" });
        return;
      }

      const decryptedMnemonic = await decrypt(accountStore?.mnemonic, oldPwd);
      const encryptedMnemonic = await encrypt(decryptedMnemonic, values.password);

      const newAccountStore = {
        ...accountStore,
        password: newPwdHash,
        mnemonic: encryptedMnemonic,
      };

      dispatch(setAccount(newAccountStore));
      dispatch(addAccountList(newAccountStore));
      setOldPwd("");
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.PROFILE_UPDATE_SUCCESS });
    } catch (err) {
      console.error("Error updating password:", err);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.PROFILE_UPDATE_FAIL, text: err.toString() });
    } finally {
      setLoading(false);
    }
  }, [accountStore, oldPwd]);

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
                <InputText 
                  id="old-password" 
                  label={t("set-74_your-old-password")} 
                  type="password" 
                  value={oldPwd} 
                  setValue={setOldPwd} 
                />
              </Box>
              
              <CreateAccountForm 
                passwordLabel={t("set-75_your-new-password")}
                confirmPasswordLabel={t("set-77_confirm-your-password")}
                buttonText={t("set-57_save")}
                showTerms={false}
                showSecurityLevel={true}
                loading={loading}
                onSubmit={updatePassword}
              />
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Password;