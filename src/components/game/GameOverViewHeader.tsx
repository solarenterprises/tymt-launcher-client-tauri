import { useTranslation } from "react-i18next";

import { Stack, Box } from "@mui/material";

import InstallButton from "./InstallButton";
import RemoveButton from "./RemoveButton";

import { IGame } from "../../types/GameTypes";

export interface IPropsGameOverViewHeader {
  game: IGame;
  purchased: boolean;
  setOpenBuyGameModal: (_: boolean) => void;
  purchaseLoading: boolean;
}

const GameOverViewHeader = ({ game, purchased, setOpenBuyGameModal, purchaseLoading }: IPropsGameOverViewHeader) => {
  const { t } = useTranslation();

  return (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
      <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
        <Box
          component={"img"}
          src={game?.imageUrl}
          width={"82px"}
          height={"82px"}
          sx={{
            borderRadius: "16px",
          }}
        />
        <Stack gap={"8px"}>
          <Box className={"fs-40-bold white"}>{game?.title}</Box>
          {game?.visibilityState === "coming soon" && (
            <Box
              className={"fs-12-regular white"}
              sx={{
                borderRadius: "8px",
                background: "rgba(255, 165, 0, 0.40)",
                backdropFilter: "blur(10px)",
                display: "flex",
                padding: "6px 2px",
                justifyContent: "center",
                alignItems: "center",
                width: "93px",
              }}
            >
              {t("hom-16_coming-soon")}
            </Box>
          )}
        </Stack>
      </Stack>
      <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
        <InstallButton game={game} purchased={purchased} setOpenBuyGameModal={setOpenBuyGameModal} purchaseLoading={purchaseLoading} />
        <RemoveButton game={game} />
      </Stack>
    </Stack>
  );
};

export default GameOverViewHeader;
