import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { emit } from "@tauri-apps/api/event";
import { Box, Button, Stack } from "@mui/material";
import { IGame } from "../../../types/GameTypes";
import RedStrokeButton from "../../account/RedStrokeButton";
import { CONST_EVENT_NAMES } from "../../../const/EventConsts";

export interface IPropsThankContent {
  game: IGame;
  setOpen: (_: boolean) => void;
}

const ThankContent = ({ game, setOpen }: IPropsThankContent) => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    setOpen(false);
    emit(CONST_EVENT_NAMES.GAME_INSTALL);
  }, [setOpen]);

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"40px"}>
      <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"24px"}>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
          <Box component={"img"} src={game?.imageUrl} alt="game" sx={{ width: "40px", height: "40px", borderRadius: "8px" }} />
          <Box className="fs-20-regular white">{game?.title}</Box>
        </Stack>
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"16px"}>
          <Box className="fs-24-regular white">{t("pur-13_thank-you-purchase")}</Box>
          <Box className="fs-16-regular white">{t("pur-14_ready-to-install")}</Box>
        </Stack>
      </Stack>

      <Stack direction={"row"} alignItems={"center"} gap={"16px"} width={"100%"}>
        <RedStrokeButton text="Close" fullWidth onClick={() => setOpen(false)} />
        <Button className={"red-button fw"} onClick={handleClick}>
          {t("pur-15_install-now")}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ThankContent;
