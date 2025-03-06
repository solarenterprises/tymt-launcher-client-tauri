import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { Button, Box, Stack } from "@mui/material";

import InstallProcessContextMenu from "./InstallProcessContextMenu";

import { getDownloadStatus, setDownloadStatus } from "../../store/DownloadStatusSlice";
import { getCurrentLogo } from "../../store/tymtLogoSlice";

import downloadbig from "../../assets/main/DownloadBig.svg";
import downloadsmall from "../../assets/main/DownloadSmall.svg";

import { IDownloadStatus, IPoint, tymtLogoType } from "../../types/HomeTypes";
import { openDir } from "../../lib/helper/DownloadHelper";
import numeral from "numeral";
import { listen } from "@tauri-apps/api/event";
import { IGame, IGameList } from "../../types/GameTypes";
import { getGameList } from "../../store/GameListSlice";
import { getDeveloperGameList } from "../../store/DeveloperGameListSlice";

const InstallingProcess = () => {
  const dispatch = useDispatch();
  const drawer: tymtLogoType = useSelector(getCurrentLogo);
  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);
  const gameListStore: IGameList = useSelector(getGameList);
  const developerGameListStore: IGameList = useSelector(getDeveloperGameList);

  const game: IGame = useMemo(
    () => [...gameListStore?.games, ...developerGameListStore?.games]?.find((one) => one?._id === downloadStatusStore?.game),
    [gameListStore, developerGameListStore, downloadStatusStore?.game]
  );

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<IPoint>({
    x: 0,
    y: 0,
  });

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setContextMenuPosition({ x: mouseX, y: mouseY });
    setShowContextMenu(true);
  };

  useEffect(() => {
    const unlisten_download_progress = listen("game-download-progress", async (event) => {
      try {
        dispatch(setDownloadStatus(event.payload));
        console.log(event.payload);
      } catch (err) {
        console.error("Failed to listen download progress: ", err);
      }
    });

    return () => {
      unlisten_download_progress.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return (
    <>
      {drawer.isDrawerExpanded && !!downloadStatusStore.game && (
        <Box onContextMenu={handleRightClick}>
          <Button
            sx={{
              width: "180px",
              height: "52px",
              marginLeft: "10px",
              marginBottom: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.20)",
              backgroundColor: "rgba(128, 128, 128, 0.10)",
              backdropFilter: "blur(50px)",
              color: "gray",
              alignItems: "center",
              display: "flex",
              justifyContent: "left",
              position: "relative",
              "&:hover": {
                backgroundColor: "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.10))",
                border: "1px solid var(--Stroke-linear-Hover, rgba(255, 255, 255, 0.10))",
              },
            }}
            onClick={async () => {
              try {
                await openDir();
              } catch (error) {
                console.error("Failed to open the directory:", error);
              }
            }}
          >
            <img
              src={game?.imageUrl}
              style={{
                position: "absolute",
                left: "0px",
                height: "50px",
                width: "40px",
                borderRadius: "16px",
              }}
            />
            <Stack
              direction={"column"}
              sx={{
                marginLeft: "25%",
              }}
            >
              <Box
                className={"fs-16 white"}
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  WebkitLineClamp: 7,
                  WebkitBoxOrient: "vertical",
                  display: "-webkit-box",
                  width: "100px",
                }}
              >
                {game?.title}
              </Box>
              <Box
                className={"fs-14-regular gray"}
                sx={{
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={downloadbig} />
                {`${numeral((downloadStatusStore?.downloaded / downloadStatusStore?.total) * 100).format("0")}%`}
              </Box>
            </Stack>
          </Button>
        </Box>
      )}
      {!drawer.isDrawerExpanded && !!downloadStatusStore?.game && (
        <Box onContextMenu={handleRightClick}>
          <Button
            sx={{
              width: "74px",
              height: "21px",
              marginLeft: "10px",
              marginBottom: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.20)",
              backgroundColor: "rgba(128, 128, 128, 0.10)",
              backdropFilter: "blur(50px)",
              color: "gray",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              "&:hover": {
                backgroundColor: "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.10))",
                border: "1px solid var(--Stroke-linear-Hover, rgba(255, 255, 255, 0.10))",
              },
            }}
            onClick={async () => {
              try {
                await openDir();
              } catch (error) {
                console.error("Failed to open the directory:", error);
              }
            }}
          >
            <img
              src={game?.imageUrl}
              style={{
                position: "absolute",
                left: "0px",
                height: "19px",
                width: "16px",
                borderRadius: "16px",
              }}
            />
            <Box
              className={"fs-14-regular gray"}
              sx={{
                marginLeft: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src={downloadsmall} width={"16px"} />
              {`${numeral((downloadStatusStore?.downloaded / downloadStatusStore?.total) * 100).format("0")}%`}
            </Box>
          </Button>
        </Box>
      )}
      <InstallProcessContextMenu view={showContextMenu} setView={setShowContextMenu} contextMenuPosition={contextMenuPosition} />
    </>
  );
};

export default InstallingProcess;
