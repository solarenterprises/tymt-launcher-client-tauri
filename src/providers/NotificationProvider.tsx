import { useCallback } from "react";
import { useSelector } from "react-redux";
import { getNotificationSetting } from "../store/NotificationSettingSlice";
import { INotificationSetting } from "../types/SettingTypes";

const useNotification = () => {
  const notificationSettingStore: INotificationSetting = useSelector(getNotificationSetting);

  const showNotification = useCallback((title: string, body: string) => {
    if (notificationSettingStore?.nativeNotification) {
      new window.Notification(title, { body, silent: !notificationSettingStore?.sound });
    }
  }, []);

  return { showNotification };
};

export default useNotification;
