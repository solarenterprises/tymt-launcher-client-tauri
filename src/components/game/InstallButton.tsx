import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

import { Button, Stack, Box } from "@mui/material";

import D53Modal from "../home/D53Modal";
import WarningModalNewGame from "../home/WarningModalNewGame";

import { useNotification } from "../../providers/NotificationProvider";

import { getDownloadStatus, resetDownloadStatus } from "../../store/DownloadStatusSlice";

import {
  /*checkOnline,*/
  downloadAndInstallNewGame,
  getGameReleaseBrowser,
  getGameReleaseNative,
  isInstalled
} from "../../lib/helper/DownloadHelper";

import { CONST_GAME_DISTRICT53 } from "../../const/games/district53/District53";

import { IGame } from "../../types/GameTypes";
import { IDownloadStatus } from "../../types/HomeTypes";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";
import { listen } from "@tauri-apps/api/event";
import { CONST_EVENT_NAMES } from "../../const/EventConsts";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export interface IPropsInstallButton {
  game: IGame;
  purchased?: boolean;
  setOpenBuyGameModal?: (_: boolean) => void;
  purchaseLoading?: boolean;
}

const webviewCache = new Map();

const InstallButton = ({ game, purchased, setOpenBuyGameModal, purchaseLoading }: IPropsInstallButton) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);

  const [modalView, setModalView] = useState<boolean>(false);
  const [d53ModalView, setD53ModalView] = useState<boolean>(false);
  const [isSupporting, setIsSupporting] = useState<boolean>(false);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  // const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      if (game?.projectMeta?.type === "browser") {
        setInstalling(true);
        showNotification({ content: CONST_NOTIFICATION_CONTENTS.LAUNCH_SUCCESS });
        const externalUrl = getGameReleaseBrowser(game)?.external_url;
        if (!externalUrl) return;

        const label = game?.title.replace(/ /g, '');

        const existingWindow = WebviewWindow.getByLabel(label);
        const actualWindow = existingWindow instanceof Promise
          ? await existingWindow
          : existingWindow;

        if (actualWindow?.label === label && (actualWindow !== null || actualWindow !== undefined)) {
          console.warn(`Duplicate label detected: ${label}`);
          (await actualWindow).destroy();
          webviewCache.delete(label);
        }

        const webview = new WebviewWindow(label, {
          url: externalUrl,
          title: game?.title || 'tymt™'
        });

        webviewCache.set(label, webview);

        console.log("Launched.")
        webview.once('tauri://created', () => {
          console.log(`Webview "${label}" created.`);
        });

        const unlisten = await webview.listen('state-change', async () => {
          console.log("Listening to webview changes")
        });


        if (webviewCache.size === 0) {
          console.log("The map is empty. Unlistening.");
          await unlisten();
        }

        return;
      }

      if (!purchased) {
        setOpenBuyGameModal(true);
        return;
      }

      if (installed) {
        if (game?._id === CONST_GAME_DISTRICT53?._id) setD53ModalView(true);
        else setModalView(true);
        return;
      }
      const id = game?.project_name;
      if (!id) return;
      // const online = await checkOnline();
      // if (!online) {
      //   showNotification({ content: CONST_NOTIFICATION_CONTENTS.INTERNET_ERROR });
      //   return;
      // }
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_START });
      await downloadAndInstallNewGame(game);
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_END });
      setInstalled(await isInstalled(game));
    } catch (err) {
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_FAIL, text: err.toString() });
    } finally {
      dispatch(resetDownloadStatus());
      setInstalling(false);
    }
  }, [game, installed, purchased]);

  useEffect(() => {
    const unlisten_game_install_from_purchase_modal = listen(CONST_EVENT_NAMES.GAME_INSTALL, async (_event) => {
      handleClick();
    });

    return () => {
      unlisten_game_install_from_purchase_modal.then((unlistenFn) => unlistenFn());
    };
  }, [handleClick]);

  useEffect(() => {
    const checkSupport = async () => {
      if (game?.projectMeta?.type === "browser") {
        setIsSupporting(true);
        return;
      }
      const release = await getGameReleaseNative(game);
      setIsSupporting(!!release);
    };
    checkSupport();
  }, [game._id]);

  useEffect(() => {
    const checkInstalled = async (game: IGame) => {
      setInstalled(await isInstalled(game));
    };

    checkInstalled(game);
  }, [game._id]);

  useEffect(() => {
    const unlisten = listen('game-installation-changed', (event: any) => {
      if (event.payload.gameId === game._id) {
        setInstalled(event.payload.installed);
      }
    });

    return () => {
      unlisten.then(f => f());
    };
  }, [game._id]);

  const isDownloading = !!downloadStatusStore?.game_id;
  const isNativeGame = game?.projectMeta?.type === "native";

  return (
    <>
      <Button
        fullWidth
        onClick={handleClick}
        disabled={
          !isSupporting ||
          (isNativeGame && isDownloading) ||
          purchaseLoading ||
          installing
        }
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
            {purchaseLoading ? (
              <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                <Box className={"fs-14-regular white t-center"}>{`Loading`}</Box>
                <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
              </Stack>
            ) : !isSupporting ? (
              t("ga-47_not-supported")
            ) : !purchased ? (
              t("ga-48_purchase")
            ) : installed ? (
              t("hom-7_play-game")
            ) : downloadStatusStore?.game_id || installing ? (
              <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                <Box className={"fs-14-regular white t-center"}>{`${t("hom-21_downloading")}`}</Box>
                <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
              </Stack>
            ) : (
              t("hom-20_install-game")
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
