import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Box, Button } from "@mui/material";
import { IPropsMode } from "../../types/HomeTypes";

const LibraryModeButton = ({ status, setStatus }: IPropsMode) => {
  const [mode, setMode] = useState(status);
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
          setMode(0);
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
          backgroundColor: mode === 0 ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: mode === 0 ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box
          sx={{
            color: mode === 0 ? "#52E1F2" : "white",
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
          {t("lib-1_your-games")}
        </Box>
      </Button>
      <Button
        onClick={() => {
          setStatus(2);
          setMode(2);
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
          backgroundColor: mode === 2 ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: mode === 2 ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box
          sx={{
            color: mode === 2 ? "#52E1F2" : "white",
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
          {t("lib-3_download")}
        </Box>
      </Button>
      <Button
        onClick={() => {
          setStatus(3);
          setMode(3);
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
          backgroundColor: mode === 3 ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: mode === 3 ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box
          sx={{
            color: mode === 3 ? "#52E1F2" : "white",
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
          {t("lib-5_coming")}
        </Box>
      </Button>
    </Stack>
  );
};

export default LibraryModeButton;
