import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Modal, Box, Fade } from "@mui/material";

import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";

import { useNotification } from "../../providers/NotificationProvider";
import { deleteGameDirectory, downloadAndInstallNewGame, getGameReleaseBrowser, isInstalled } from "../../lib/helper/DownloadHelper";
import { resetDownloadStatus } from "../../store/DownloadStatusSlice";

import { IPoint } from "../../types/HomeTypes";
import { IGame } from "../../types/GameTypes";
import WarningModalNewGame from "../home/WarningModalNewGame";
import { openLink } from "../../lib/helper/TauriHelper";
import { delOneDeveloperGameList } from "../../store/DeveloperGameListSlice";

export interface IPropsUserListItemContextMenu {
  view: boolean;
  setView: (_: boolean) => void;
  contextMenuPosition: IPoint;
  game: IGame;
}

const DeveloperGameCardContextMenu = ({ view, setView, contextMenuPosition, game }: IPropsUserListItemContextMenu) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const [modalView, setModalView] = useState<boolean>(false);
  const [installed, setInstalled] = useState<boolean>(false);

  const handleOnClose = () => {
    setView(false);
  };

  const handleDownload = async (currentGame: IGame) => {
    try {
      setView(false);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_START });
      await downloadAndInstallNewGame(currentGame);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_END });
      setInstalled(true);
    } catch (err) {
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_FAIL, text: err.toString() });
    } finally {
      dispatch(resetDownloadStatus());
    }
  };

  const handleUninstall = async (currentGame: IGame) => {
    try {
      setView(false);
      await deleteGameDirectory(currentGame);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.REMOVE_SUCCESS });
      setInstalled(false);
    } catch (err) {
      console.error("Failed to handleRemoveClick: ", err);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.REMOVE_FAIL, text: err.toString() });
    }
  };

  const handleRunGame = (currentGame: IGame) => {
    try {
      setView(false);
      if (currentGame?.projectMeta?.type === "browser") {
        const externalUrl = getGameReleaseBrowser(currentGame)?.external_url;
        if (!externalUrl) return;
        openLink(externalUrl);
        return;
      }
      setModalView(true);
    } catch (err) { }
  };

  const handleRemoveGameFromDeveloperGameList = async (currentGame: IGame) => {
    dispatch(delOneDeveloperGameList(currentGame));
  };

  useEffect(() => {
    const init = async () => {
      const res = await isInstalled(game);
      setInstalled(res);
    };
    init();
  }, [game]);

  return (
    <>
      <Modal open={view} onClose={handleOnClose}>
        <Fade in={view}>
          <Box
            sx={{
              position: "fixed",
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
              display: "block",
              flexDirection: "column",
              alignItems: "flex-start",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            {game?.projectMeta?.type === "browser" && (
              <>
                <Box className={"fs-16 white context_menu_up"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={() => handleRunGame(game)}>
                  {t("hom-7_play-game")}
                </Box>
                <Box
                  className={"fs-16 white context_menu_bottom"}
                  textAlign={"left"}
                  sx={{ backdropFilter: "blur(10px)" }}
                  onClick={() => handleRemoveGameFromDeveloperGameList(game)}
                >
                  {t("ga-46_remove-from-developer-store")}
                </Box>
              </>
            )}
            {game?.projectMeta?.type === "native" && installed && (
              <>
                <Box className={"fs-16 white context_menu_up"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={() => handleRunGame(game)}>
                  {t("hom-7_play-game")}
                </Box>
                <Box
                  className={"fs-16 white context_menu_bottom"}
                  textAlign={"left"}
                  sx={{ backdropFilter: "blur(10px)" }}
                  onClick={() => handleUninstall(game)}
                >
                  {t("ga-44_remove")}
                </Box>
              </>
            )}
            {game?.projectMeta?.type === "native" && !installed && (
              <>
                <Box className={"fs-16 white context_menu_up"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={() => handleDownload(game)}>
                  {t("lib-3_download")}
                </Box>
                <Box
                  className={"fs-16 white context_menu_bottom"}
                  textAlign={"left"}
                  sx={{ backdropFilter: "blur(10px)" }}
                  onClick={() => handleRemoveGameFromDeveloperGameList(game)}
                >
                  {t("ga-46_remove-from-developer-store")}
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
      <WarningModalNewGame open={modalView} setOpen={setModalView} game={game} />
    </>
  );
};

export default DeveloperGameCardContextMenu;
