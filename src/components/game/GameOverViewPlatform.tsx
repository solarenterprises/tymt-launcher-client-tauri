import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Box, Stack } from "@mui/material";

import { CONST_SYSINFO_OS } from "../../const/SysInfoConsts";

import { getSupportOSList } from "../../lib/helper/GameHelper";

import { IGame, platformEnum, platformIconMap } from "../../types/GameTypes";

export interface IPropsGameOverViewPlatform {
  game: IGame;
}

const GameOverViewPlatform = ({ game }: IPropsGameOverViewPlatform) => {
  const { t } = useTranslation();

  const supportOSList = useMemo(() => getSupportOSList(game), [game]);

  return (
    supportOSList?.length > 0 && (
      <Box
        sx={{
          paddingTop: "12px",
          paddingBottom: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box className={"fs-14-regular gray"}>{t("sto-4_platform")}</Box>
        <Stack direction={"row"} alignItems={"center"}>
          {supportOSList?.some((one) => one === CONST_SYSINFO_OS.WINDOWS) && (
            <img src={platformIconMap.get(platformEnum.windows)} width={"16px"} style={{ marginLeft: "5px", marginRight: "5px" }} />
          )}
          {supportOSList?.some((one) => one === CONST_SYSINFO_OS.LINUX) && (
            <img src={platformIconMap.get(platformEnum.linux)} width={"16px"} style={{ marginLeft: "5px", marginRight: "5px" }} />
          )}
          {supportOSList?.some((one) => one === CONST_SYSINFO_OS.MACOS) && (
            <img src={platformIconMap.get(platformEnum.mac)} width={"16px"} style={{ marginLeft: "5px", marginRight: "5px" }} />
          )}
        </Stack>
      </Box>
    )
  );
};

export default GameOverViewPlatform;
