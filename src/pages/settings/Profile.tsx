import { useTranslation } from "react-i18next";
import { FC, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Box, Button, CircularProgress, Divider, Stack, Tooltip } from "@mui/material";

import Avatar from "../../components/home/Avatar";
import InputText from "../../components/account/InputText";

import { useNotification } from "../../providers/NotificationProvider";

import { AppDispatch } from "../../store";
import { addAccountList } from "../../store/AccountListSlice";
import { getAccount, setAccount } from "../../store/AccountSlice";

import { UserAPI } from "../../lib/api/UserAPI";

import { IAccount } from "../../types/AccountTypes";

import backIcon from "../../assets/setting/BackIcon.svg";
import editIcon from "../../assets/setting/EditIcon.svg";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";

interface IPropsProfile {
  view: string;
  setView: (panel: string) => void;
}

const Profile: FC<IPropsProfile> = ({ view, setView }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { showNotification } = useNotification();

  const accountStore: IAccount = useSelector(getAccount);

  const [nickname, setNickname] = useState(accountStore?.nickname);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.string()
    .required(t("cca-63_required"))
    .min(3, t("ncca-59_too-short"))
    .max(50, t("ncca-60_too-long"))
    .matches(/^[a-zA-Z0-9_ !@#$%^&*()\-+=,.?]+$/, t("ncca-61_invalid-characters"));

  const updateAccount = useCallback(async () => {
    try {
      setLoading(true);
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
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.PROFILE_UPDATE_SUCCESS });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message);
      } else {
        showNotification({ content: CONST_NOTIFICATION_CONTENTS.PROFILE_UPDATE_FAIL, text: err.toString() });
      }
    } finally {
      setLoading(false);
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
      setLoading(true);
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
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.AVATAR_UPDATE_SUCCESS });
    } catch (err) {
      console.error("Failed to uploadImage: ", err);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.AVATAR_UPDATE_FAIL, text: err.toString() });
    } finally {
      setLoading(false);
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
                  <Avatar onlineStatus={true} url={accountStore?.avatar} size={92} status="active" />
                </Box>
                <Box className="fs-h5 white">{t("set-68_change-avatar")}</Box>
              </Stack>
              <Box className="center-align">
                <Box sx={{ display: "flex" }} className="common-btn" onClick={launchUploader}>
                  <Tooltip
                    title={t("set-82_edit")}
                    sx={{ padding: "6px 8px 6px 8px", borderRadius: "32px", border: "1px", borderColor: "#FFFFFF1A", backgroundColor: "#8080804D" }}
                  >
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
              <Button fullWidth className={"red-border-button"} onClick={updateAccount} disabled={loading}>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: "#F5EBFF",
                    }}
                  />
                ) : (
                  t("set-57_save")
                )}
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Profile;
