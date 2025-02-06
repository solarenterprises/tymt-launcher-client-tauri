import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import SwitchComp from "../../components/home/SwitchComp";

import { AppDispatch } from "../../store";
import { getNotificationSetting, setNotificationSetting } from "../../store/NotificationSettingSlice";

import { INotificationSetting } from "../../types/SettingTypes";

import backIcon from "../../assets/setting/BackIcon.svg";

export interface IPropsNotification {
  view: string;
  setView: (_: string) => void;
}

const Notification = ({ view, setView }: IPropsNotification) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const notificationSettingStore: INotificationSetting = useSelector(getNotificationSetting);

  const updateNotificationSetting = useCallback(
    (option: keyof INotificationSetting) => {
      dispatch(
        setNotificationSetting({
          ...notificationSettingStore,
          [option]: !notificationSettingStore[option],
        })
      );
    },
    [notificationSettingStore, dispatch]
  );
  return (
    <>
      {view === "notification" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-48_notifications")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                <Box className="fs-h5 white">{t("set-41_sound")}</Box>
                <Box
                  className="fs-14-regular gray"
                  sx={{
                    whiteSpace: "normal",
                  }}
                >
                  {t("set-42_sound-detail")}
                </Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1} alignItems={"center"}>
                <SwitchComp
                  checked={notificationSettingStore?.sound}
                  onClick={() => {
                    updateNotificationSetting("sound");
                  }}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                <Box className="fs-h5 white">{t("set-39_in-app-notification")}</Box>
                <Box
                  className="fs-14-regular gray"
                  sx={{
                    whiteSpace: "normal",
                  }}
                >
                  {t("set-40_in-app-detail")}
                </Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1} alignItems={"center"}>
                <SwitchComp
                  checked={notificationSettingStore?.inAppNotification}
                  onClick={() => {
                    updateNotificationSetting("inAppNotification");
                  }}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                <Box className="fs-h5 white">{t("set-43_native-notification")}</Box>
                <Box
                  className="fs-14-regular gray"
                  sx={{
                    whiteSpace: "normal",
                  }}
                >
                  {t("set-44_native-notification-detail")}
                </Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1} alignItems={"center"}>
                <SwitchComp
                  checked={notificationSettingStore?.nativeNotification}
                  onClick={() => {
                    updateNotificationSetting("nativeNotification");
                  }}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Notification;
