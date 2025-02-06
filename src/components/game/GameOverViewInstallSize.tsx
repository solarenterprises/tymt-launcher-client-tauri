import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

import { Box } from "@mui/material";

import { getGameInstallSize } from "../../lib/helper/GameHelper";

import { IGame } from "../../types/GameTypes";

import storeStyles from "../../styles/StoreStyles";

export interface IPropsGameOverViewInstallSize {
  game: IGame;
}

const GameOverViewInstallSize = ({ game }: IPropsGameOverViewInstallSize) => {
  const classes = storeStyles();

  const { t } = useTranslation();

  const [installSize, setInstallSize] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const newInstallSize = parseFloat(await getGameInstallSize(game));
      setInstallSize(newInstallSize / 1024 / 1024);
    };

    init();
  }, [game]);

  return (
    installSize > 0 && (
      <Box className={classes.box_gameoption}>
        <Box className={"fs-14-regular gray"}>{t("sto-50_install-size")}</Box>
        <Box className={"fs-14-regular white"}>{numeral(installSize).format("0,0.[00]")} MB</Box>
      </Box>
    )
  );
};

export default GameOverViewInstallSize;
