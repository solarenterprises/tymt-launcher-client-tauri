import { useTranslation } from "react-i18next";
import { FC, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";

import useNotification from "../../providers/NotificationProvider";
import Avatar from "../../components/home/Avatar";
import InputText from "../../components/account/InputText";

import { AppDispatch } from "../../store";
import { addAccountList } from "../../store/AccountListSlice";
import { getAccount, setAccount } from "../../store/AccountSlice";

import { UserAPI } from "../../lib/api/UserAPI";

import { IAccount } from "../../types/AccountTypes";

import SettingStyle from "../../styles/SettingStyle";

import backIcon from "../../assets/setting/BackIcon.svg";
import editIcon from "../../assets/setting/EditIcon.svg";

interface IPropsProfile {
  view: string;
  setView: (panel: string) => void;
}

const Profile: FC<IPropsProfile> = ({ view, setView }) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const dispatch = useDispatch<AppDispatch>();

  const accountStore: IAccount = useSelector(getAccount);

  const [nickname, setNickname] = useState(accountStore?.nickname);
  const [error, setError] = useState<string>("");

  const validationSchema = Yup.string()
    .required(t("cca-63_required"))
    .min(3, t("ncca-59_too-short"))
    .max(50, t("ncca-60_too-long"))
    .matches(/^[a-zA-Z0-9_ !@#$%^&*()\-+=,.?]+$/, t("ncca-61_invalid-characters"));

  const updateAccount = useCallback(async () => {
    try {
      await validationSchema.validate(nickname);
      setError("");

      const updatedUser = await UserAPI.updateProfile({ nickname });
      const updatedAccount = {
        ...updatedUser,
        password: accountStore?.password,
        mnemonic: accountStore?.mnemonic,
      };
      dispatch(setAccount(updatedAccount));
      dispatch(addAccountList(updatedAccount));

      showNotification(t("alt-1_nickname-saved"), t("alt-2_nickname-saved-intro"));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message);
      }
      showNotification(t("alt-3_nickname-notsaved"), t("alt-4_nickname-notsaved-intro"));
    }
  }, [nickname, accountStore]);

  const launchUploader = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const uploadImage = useCallback(async () => {
    try {
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      const file = fileInput.files ? fileInput.files[0] : null;
      const formData = new FormData();
      formData.append("avatar", file);
      const updatedUser = await UserAPI.updateAvatar(formData);
      const updatedAccount = {
        ...updatedUser,
        password: accountStore?.password,
        mnemonic: accountStore?.mnemonic,
      };
      dispatch(setAccount(updatedAccount));
      dispatch(addAccountList(updatedAccount));
    } catch (err) {
      console.log(err);
    }
  }, [accountStore]);

  return (
    <>
      {view === "profile" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" onChange={uploadImage} style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-10_profile")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"30px"}>
              <Stack direction={"row"} justifyContent={"center"} textAlign={"right"} alignItems={"center"} gap={"10px"}>
                <Box className="center-align">
                  {/* <img src={avatar} /> */}
                  <Avatar onlineStatus={true} url={accountStore?.avatar} size={92} status="active" />
                </Box>
                <Box className="fs-h5 white">{t("set-68_change-avatar")}</Box>
              </Stack>
              <Box className="center-align">
                <Box sx={{ display: "flex" }} className="common-btn" onClick={launchUploader}>
                  <Tooltip title={t("set-82_edit")} classes={{ tooltip: classname.tooltip }}>
                    <img src={editIcon} style={{ cursor: "pointer" }} />
                  </Tooltip>
                </Box>
              </Box>
            </Stack>
            <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"center"} padding={"20px"}>
              <Box className="fs-h4 white">
                <InputText id="change-nickname" label={t("set-69_change-nickname")} type="text" value={nickname} setValue={setNickname} />
              </Box>
              {error && (
                <Stack mt={"8px"} padding={"0px 6px"} width={"100%"}>
                  <Box className={"fs-16-regular red"}>{error}</Box>
                </Stack>
              )}
              <Box textAlign={"left"} className="fs-14-light gray p-t-10">
                {t("set-70_nickname-detail")}
              </Box>
            </Stack>
            <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
              <Button fullWidth className={classname.action_button} onClick={updateAccount}>
                {t("set-57_save")}
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Profile;
