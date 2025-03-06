import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Box, Button } from "@mui/material";
import { IPropsMode } from "../../types/HomeTypes";

const DeveloperSwitchButton = ({ status, setStatus }: IPropsMode) => {
  const { t } = useTranslation();
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"2px"}
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
          setStatus(0);
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
          backgroundColor: status === 0 ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: status === 0 ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box
          sx={{
            color: status === 0 ? "#52E1F2" : "white",
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
          {t("sto-56_local-store")}
        </Box>
      </Button>
      <Button
        onClick={() => {
          setStatus(1);
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
          backgroundColor: status === 1 ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: status === 1 ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box
          sx={{
            color: status === 1 ? "#52E1F2" : "white",
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
          {t("sto-57_import-new")}
        </Box>
      </Button>
    </Stack>
  );
};

export default DeveloperSwitchButton;
