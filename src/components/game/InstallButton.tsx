import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { Button, Stack, Box } from "@mui/material";
import D53Modal from "../home/D53Modal";
import WarningModalNewGame from "../home/WarningModalNewGame";
import { useNotification } from "../../providers/NotificationProvider";
import { getDownloadStatus  } from "../../store/DownloadStatusSlice";
import { downloadFileToAppDir, getFullExecutablePathNewGame, getGameReleaseBrowser, isGameInstalled, openGame } from "../../lib/helper/DownloadHelper";
import { CONST_GAME_DISTRICT53 } from "../../const/games/district53/District53";
import { IGame } from "../../types/GameTypes";
import { IDownloadStatus } from "../../types/HomeTypes";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export interface IPropsInstallButton {
  game: IGame;
  purchased?: boolean;
  setOpenBuyGameModal?: (_: boolean) => void;
  purchaseLoading?: boolean;
}

export type DownloadEventPayload =
  | {
    event: "Started";
    data: {
      game_title: string;
    };
  }
  | {
    event: "Progress";
    data: {
      game_title: string;
      file_index: number;
      percent: number;
    };
  }
  | {
    event: "Finished";
    data: {
      game_title: string;
    };
  };

const webviewCache = new Map();

const InstallButton = ({ game, purchased, setOpenBuyGameModal, purchaseLoading }: IPropsInstallButton) => {
  // const { t } = useTranslation(); // for translations

  const { showNotification } = useNotification();
  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isSupporting, setIsSupporting] = useState<boolean>(false);
  const [modalView, setModalView] = useState<boolean>(false);
  const [d53ModalView, setD53ModalView] = useState<boolean>(false);

  useEffect(() => {
    const checkSupport = async () => {
      const fullPath = await getFullExecutablePathNewGame(game);
      setIsSupporting(!!fullPath);
    };
    checkSupport();
  }, [game]);

  useEffect(() => {
    const checkInstalled = async () => {
      const exists = await isGameInstalled(game);
      setInstalled(exists);
    };
    checkInstalled();

    if (game?.projectMeta?.type === 'native') {
      checkInstalled();
    }  
  }, [game, ]);


  const handleOpenBrowserGame = async () => {
    if (game?.projectMeta?.type !== "browser") return;

    const externalUrl = getGameReleaseBrowser(game)?.external_url;
    if (!externalUrl) return;

    const label = game?.title.replace(/ /g, '');

    const existingWindow = WebviewWindow.getByLabel(label);
    const actualWindow = existingWindow instanceof Promise
      ? await existingWindow
      : existingWindow;

    if (actualWindow?.label === label && (actualWindow !== null || actualWindow !== undefined)) {
      console.warn(`Duplicate label detected: ${label}`);
      await actualWindow.destroy();
      webviewCache.delete(label);
    }

    showNotification({ content: CONST_NOTIFICATION_CONTENTS.LAUNCH_SUCCESS });

    const webview = new WebviewWindow(label, {
      url: externalUrl,
      title: game?.title || 'tymt™'
    });

    webviewCache.set(label, webview);

    console.log("Launched.");
    webview.once('tauri://created', () => {
      console.log(`Webview "${label}" created.`);
    });

    const unlisten = await webview.listen('state-change', () => {
      console.log("Listening to webview changes");
    });

    if (webviewCache.size === 0) {
      console.log("The map is empty. Unlistening.");
      await unlisten();
    }

    // If the user hasn't purchased the game, show the buy modal
    if (!purchased) {
      setOpenBuyGameModal(true);
      return;
    }

    // If the game is installed and is D53 or other, show modals
    if (installed) {
      if (game?._id === CONST_GAME_DISTRICT53?._id) setD53ModalView(true);
      else setModalView(true);
      return;
    }
  };

  const handleInstall = async () => {

    if (!purchased) {
      setOpenBuyGameModal(true);
      return;
    }

    if (installed) {
      if (game?._id === CONST_GAME_DISTRICT53?._id) setD53ModalView(true);
      else setModalView(true);
      return;
    }

    await downloadFileToAppDir(game, (event) => {
      switch (event.event) {
        case "Started":
          setInstalling(true);
          setStatus(`Started downloading ${event.data?.game_title}`);
          setProgress(0);
          showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_START });
          break;
        case "Progress":
          setProgress(event.data?.percent ?? 0);
          setStatus(`Downloading ${event.data?.game_title}: ${event.data?.percent}%`);
          break;
        case "Finished":
          setProgress(100);
          setStatus("Download finished");
          showNotification({ content: CONST_NOTIFICATION_CONTENTS.DOWNLOAD_END });
          setInstalling(false);
          setInstalled(true);
          break;
        default:
          setStatus(`Error: ${event}`);
          setInstalling(false);
          setInstalled(false);
          break;
      }
    });
  };

  const onClickHandler = async () => {
    if (game?.projectMeta?.type === "browser") {
      await handleOpenBrowserGame();
    } else if (installed) {
      console.log("open game");
      openGame(game);
    } else if (!installed) {
      await handleInstall();
    }
  };

  // const onClickHandler = installed ? () => openGame(game) : handleInstall;

  return (
    <>
      <Button
        fullWidth
        onClick={onClickHandler}
        disabled={!isSupporting || !!downloadStatusStore?.game_id || purchaseLoading || installing}
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
        {game?.projectMeta?.type === "browser" && "Play Game"}
        {game?.projectMeta?.type === "native" && (
          <>
            {purchaseLoading ? (
              <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                <Box className={"fs-14-regular white t-center"}>Loading</Box>
                <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
              </Stack>
            ) : !isSupporting ? (
              "Not Supported"
            ) : !purchased ? (
              "Purchase"
            ) : installed ? (
              "Open Game"
            ) : downloadStatusStore?.game_id || installing ? (
              <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                <Box className={"fs-14-regular white t-center"}>
                  {`Downloading ${Math.floor(progress)}%`}
                </Box>
                <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
              </Stack>
            ) : (
              "Install Game"
            )}
          </>
        )}
      </Button>

      {status !== "Idle" && (
        <Box mt={1} className="fs-12-regular white t-center">
          Status: {status}
        </Box>
      )}
      <WarningModalNewGame open={modalView} setOpen={setModalView} game={game} />
      <D53Modal open={d53ModalView} setOpen={setD53ModalView} />
    </>
  );
};

export default InstallButton;