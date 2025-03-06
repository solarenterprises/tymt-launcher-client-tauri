import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import { IGame } from "../../types/GameTypes";

export interface IPropsGameOverViewNative {
  game: IGame;
}

const GameOverViewNative = ({ game }: IPropsGameOverViewNative) => {
  const { t } = useTranslation();

  return (
    game?.projectMeta?.type && (
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
        <Box className={"fs-14-regular gray"}>{t("sto-39_type")}</Box>
        <Box className={"fs-14-regular white"}>{game?.projectMeta?.type}</Box>
      </Box>
    )
  );
};

export default GameOverViewNative;
