import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

import { Button, Stack, Box } from "@mui/material";

import D53Modal from "../home/D53Modal";
import WarningModalNewGame from "../home/WarningModalNewGame";

import { useNotification } from "../../providers/NotificationProvider";

import { getDownloadStatus, resetDownloadStatus } from "../../store/DownloadStatusSlice";

import { openLink } from "../../lib/helper/TauriHelper";
import { checkOnline, downloadAndInstallNewGame, getFullExecutablePathNewGame, getGameReleaseBrowser, isInstalled } from "../../lib/helper/DownloadHelper";

import { CONST_GAME_DISTRICT53 } from "../../const/games/district53/District53";

import { IGame } from "../../types/GameTypes";
import { IDownloadStatus } from "../../types/HomeTypes";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";

export interface IPropsInstallButton {
  game: IGame;
}

const InstallButton = ({ game }: IPropsInstallButton) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);

  const [modalView, setModalView] = useState<boolean>(false);
  const [d53ModalView, setD53ModalView] = useState<boolean>(false);
  const [isSupporting, setIsSupporting] = useState<boolean>(false);
  const [installed, setInstalled] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      if (game?.projectMeta?.type === "browser") {
        const externalUrl = getGameReleaseBrowser(game)?.external_url;
        if (!externalUrl) return;
        openLink(externalUrl);
        return;
      }
      if (installed) {
        if (game?._id === CONST_GAME_DISTRICT53?._id) setD53ModalView(true);
        else setModalView(true);
        return;
      }
      const id = game?.project_name;
      if (!id) return;
      const online = await checkOnline();
      if (!online) {
        showNotification({ content: CONST_NOTIFICATION_CONTENTS.INTERNET_ERROR });
        return;
      }
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_START });
      await downloadAndInstallNewGame(game);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_END });
      setInstalled(await isInstalled(game));
    } catch (err) {
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_FAIL, text: err.toString() });
    } finally {
      dispatch(resetDownloadStatus());
    }
  }, [game, installed]);

  useEffect(() => {
    const checkSupport = async () => {
      const fullPath = await getFullExecutablePathNewGame(game);
      if (!fullPath) setIsSupporting(false);
      else setIsSupporting(true);
    };
    checkSupport();
  }, [game]);

  useEffect(() => {
    const checkInstalled = async (game: IGame) => {
      setInstalled(await isInstalled(game));
    };

    checkInstalled(game);
    const intervalId = setInterval(() => checkInstalled(game), 1 * 1e3);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [game]);

  return (
    <>
      <Button
        fullWidth
        onClick={handleClick}
        disabled={!isSupporting || !!downloadStatusStore?.game}
        sx={{
          height: "46px",
          width: "226px",
          color: "white",
          fontFamily: "Cobe-Bold",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "normal",
          borderRadius: "16px",
          backgroundColor: "#ef4444",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#992727",
          },
          "&.Mui-disabled": {
            backgroundColor: "#2a2525",
            color: "#7c7c7c",
          },
        }}
      >
        {game?.projectMeta?.type === "browser" && t("hom-7_play-game")}
        {game?.projectMeta?.type === "native" && (
          <>
            {!isSupporting && `Not supported`}
            {isSupporting && !installed && !downloadStatusStore?.game && t("hom-20_install-game")}
            {isSupporting && installed && !downloadStatusStore?.game && t("hom-7_play-game")}
            {downloadStatusStore?.game && (
              <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                <Box className={"fs-14-regular white t-center"}>{`${t("hom-21_downloading")}`}</Box>
                <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
              </Stack>
            )}
          </>
        )}
      </Button>
      <WarningModalNewGame open={modalView} setOpen={setModalView} game={game} />
      <D53Modal open={d53ModalView} setOpen={setD53ModalView} />
    </>
  );
};

export default InstallButton;
