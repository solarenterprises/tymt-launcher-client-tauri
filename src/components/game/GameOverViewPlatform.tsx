import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Box, Stack } from "@mui/material";

import { CONST_SYSINFO_OS } from "../../const/SysInfoConsts";

import { getSupportOSList } from "../../lib/helper/GameHelper";

import { IGame, platformEnum, platformIconMap } from "../../types/GameTypes";

import storeStyles from "../../styles/StoreStyles";

export interface IPropsGameOverViewPlatform {
  game: IGame;
}

const GameOverViewPlatform = ({ game }: IPropsGameOverViewPlatform) => {
  const classes = storeStyles();
  const { t } = useTranslation();

  const supportOSList = useMemo(() => getSupportOSList(game), [game]);

  return (
    supportOSList?.length > 0 && (
      <Box className={classes.box_gameoption}>
        <Box className={"fs-14-regular gray"}>{t("sto-4_platform")}</Box>
        <Stack direction={"row"} alignItems={"center"}>
          {supportOSList?.some((one) => one === CONST_SYSINFO_OS.WINDOWS) && (
            <img src={platformIconMap.get(platformEnum.windows)} width={"16px"} className={classes.platform} />
          )}
          {supportOSList?.some((one) => one === CONST_SYSINFO_OS.LINUX) && (
            <img src={platformIconMap.get(platformEnum.linux)} width={"16px"} className={classes.platform} />
          )}
          {supportOSList?.some((one) => one === CONST_SYSINFO_OS.MACOS) && (
            <img src={platformIconMap.get(platformEnum.mac)} width={"16px"} className={classes.platform} />
          )}
        </Stack>
      </Box>
    )
  );
};

export default GameOverViewPlatform;
