import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Stack, Box, Button } from "@mui/material";

import { getWalletSetting, setWalletSetting } from "../../store/WalletSettingSlice";

import { IWalletSetting } from "../../types/SettingTypes";

import SettingStyle from "../../styles/SettingStyle";

const FeeSwitchButton = () => {
  const { t } = useTranslation();
  const classname = SettingStyle();
  const dispatch = useDispatch();

  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={"6px"} className={classname.fee_switch_container}>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          dispatch(setWalletSetting({ ...walletSettingStore, feeLevel: "minimum" }));
        }}
        sx={{
          backgroundColor: walletSettingStore?.feeLevel === "minimum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.feeLevel === "minimum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletSettingStore?.feeLevel === "minimum" ? "#52E1F2" : "white" }}>
          {t("set-58_minimum")}
        </Box>
      </Button>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          dispatch(setWalletSetting({ ...walletSettingStore, feeLevel: "average" }));
        }}
        sx={{
          backgroundColor: walletSettingStore?.feeLevel === "average" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.feeLevel === "average" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletSettingStore?.feeLevel === "average" ? "#52E1F2" : "white" }}>
          {t("set-59_average")}
        </Box>
      </Button>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          dispatch(setWalletSetting({ ...walletSettingStore, feeLevel: "maximum" }));
        }}
        sx={{
          backgroundColor: walletSettingStore?.feeLevel === "maximum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.feeLevel === "maximum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletSettingStore?.feeLevel === "maximum" ? "#52E1F2" : "white" }}>
          {t("set-60_maximum")}
        </Box>
      </Button>
    </Stack>
  );
};

export default FeeSwitchButton;
