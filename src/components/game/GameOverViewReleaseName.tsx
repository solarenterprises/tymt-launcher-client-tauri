import { Box } from "@mui/material";

import { IGame } from "../../types/GameTypes";

import { useTranslation } from "react-i18next";

export interface IPropsGameOverViewReleaseName {
  game: IGame;
}

const GameOverViewReleaseName = ({ game }: IPropsGameOverViewReleaseName) => {
  const { t } = useTranslation();

  return (
    game?.releaseMeta?.name && (
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
        <Box className={"fs-14-regular gray"}>{t("sto-37_release-version")}</Box>
        <Box className={"fs-14-regular white"}>{game?.releaseMeta?.name}</Box>
      </Box>
    )
  );
};

export default GameOverViewReleaseName;
