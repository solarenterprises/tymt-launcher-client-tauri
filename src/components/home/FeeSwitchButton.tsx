import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Stack, Box, Button } from "@mui/material";

import { getWalletSetting, setWalletSetting } from "../../store/WalletSettingSlice";

import { IWalletSetting } from "../../types/SettingTypes";

const FeeSwitchButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"6px"}
      sx={{
        padding: "2px",
        borderRadius: "16px",
        gap: "2px",
        border: "1px solid",
        borderColor: "#FFFFFF1A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        onClick={() => {
          dispatch(setWalletSetting({ ...walletSettingStore, feeLevel: "minimum" }));
        }}
        sx={{
          "&.MuiButtonBase-root, &.MuiBox-root": {
            display: "block",
            textTransform: "none",
            color: "#52E1F21A",
            minWidth: "unset",
            boxShadow: "none",
            padding: "0px",
            borderRadius: "16px",
          },
          backgroundColor: walletSettingStore?.feeLevel === "minimum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.feeLevel === "minimum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box
          sx={{
            color: walletSettingStore?.feeLevel === "minimum" ? "#52E1F2" : "white",
            padding: "8px 16px 8px 16px",
            fontFeatureSettings: "'calt' off",
            fontFamily: "Cobe",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "24px" /* 133.333% */,
            letterSpacing: "-0.36px",
          }}
        >
          {t("set-58_minimum")}
        </Box>
      </Button>
      <Button
        onClick={() => {
          dispatch(setWalletSetting({ ...walletSettingStore, feeLevel: "average" }));
        }}
        sx={{
          "&.MuiButtonBase-root, &.MuiBox-root": {
            display: "block",
            textTransform: "none",
            color: "#52E1F21A",
            minWidth: "unset",
            boxShadow: "none",
            padding: "0px",
            borderRadius: "16px",
          },
          backgroundColor: walletSettingStore?.feeLevel === "average" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.feeLevel === "average" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box
          sx={{
            color: walletSettingStore?.feeLevel === "average" ? "#52E1F2" : "white",
            padding: "8px 16px 8px 16px",
            fontFeatureSettings: "'calt' off",
            fontFamily: "Cobe",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "24px" /* 133.333% */,
            letterSpacing: "-0.36px",
          }}
        >
          {t("set-59_average")}
        </Box>
      </Button>
      <Button
        onClick={() => {
          dispatch(setWalletSetting({ ...walletSettingStore, feeLevel: "maximum" }));
        }}
        sx={{
          "&.MuiButtonBase-root, &.MuiBox-root": {
            display: "block",
            textTransform: "none",
            color: "#52E1F21A",
            minWidth: "unset",
            boxShadow: "none",
            padding: "0px",
            borderRadius: "16px",
          },
          backgroundColor: walletSettingStore?.feeLevel === "maximum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.feeLevel === "maximum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box
          sx={{
            color: walletSettingStore?.feeLevel === "maximum" ? "#52E1F2" : "white",
            padding: "8px 16px 8px 16px",
            fontFeatureSettings: "'calt' off",
            fontFamily: "Cobe",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "24px" /* 133.333% */,
            letterSpacing: "-0.36px",
          }}
        >
          {t("set-60_maximum")}
        </Box>
      </Button>
    </Stack>
  );
};

export default FeeSwitchButton;
