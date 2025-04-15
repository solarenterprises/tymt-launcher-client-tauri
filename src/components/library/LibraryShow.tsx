import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Box, Stack } from "@mui/material";

import AnimatedComponent from "../home/AnimatedComponent";
import StoreGameCard from "../game/StoreGameCard";

import { isInstalled } from "../../lib/helper/DownloadHelper";

import NoGamePng from "../../assets/main/NoGames.png";

import { IGame, IGameList } from "../../types/GameTypes";
import { useSelector } from "react-redux";
import { getGameList } from "../../store/GameListSlice";
import { getLibraryList } from "../../store/LibraryListSlice";

export interface IPropsLibraryShow {
  status: number;
}

const LibraryShow = ({ status }: IPropsLibraryShow) => {
  const { t } = useTranslation();

  const gameListStore: IGameList = useSelector(getGameList);
  const libraryListStore: IGameList = useSelector(getLibraryList);

  const activeGameList: IGame[] = useMemo(() => gameListStore?.games?.filter((one) => one?.visibilityState === "active"), [gameListStore]);
  const displayGameList: IGame[] = useMemo(() => [...activeGameList], [activeGameList]);

  const [installedList, setInstalledList] = useState<IGame[]>([]);

  const uninstalledList: IGame[] = useMemo(
    () => displayGameList?.filter((game) => ![...libraryListStore?.games, ...installedList]?.some((one) => one?._id === game?._id)),
    [displayGameList, installedList, libraryListStore]
  );

  useEffect(() => {
    const fetchInstalledGames = async () => {
      // setLoading(true);
      const results = await Promise.all(
        displayGameList?.map(async (game) => {
          const installed = await isInstalled(game);
          return installed ? game : null;
        })
      );
      setInstalledList(results.filter((game) => game !== null));
      // setLoading(false);
    };

    fetchInstalledGames();
  }, [displayGameList]);

  return (
    <>
      <Grid item xs={12}>
        {status === 0 && <Box className={"fs-40-bold white"}>{t("lib-1_your-games")}</Box>}
        {status === 1 && <Box className={"fs-40-bold white"}>{t("lib-2_wishlist")}</Box>}
        {status === 2 && <Box className={"fs-40-bold white"}>{t("lib-3_download")}</Box>}
        {status === 3 && <Box className={"fs-40-bold white"}>{t("lib-5_coming")}</Box>}
      </Grid>
      <Grid item xs={12} container spacing={"32px"} mt={"32px"}>
        {status === 0 &&
          [...libraryListStore?.games, ...installedList]?.map((installedGame, index) => (
            <Grid item key={index}>
              <AnimatedComponent>
                <StoreGameCard game={installedGame} />
              </AnimatedComponent>
            </Grid>
          ))}
        {status === 0 && [...libraryListStore?.games, ...installedList]?.length === 0 && (
          <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
            <AnimatedComponent>
              <Stack flexDirection={"column"} justifyContent={"center"}>
                <Box component={"img"} src={NoGamePng} width={"300px"} height={"300px"} alignSelf={"center"} />
                <Box className={"fs-18-regular white"} sx={{ alignSelf: "center", marginTop: "24px" }}>
                  {t("sto-36_no-games")}
                </Box>
              </Stack>
            </AnimatedComponent>
          </Grid>
        )}
        {status === 2 &&
          uninstalledList?.map((uninstalledGame, index) => (
            <Grid item key={index}>
              <AnimatedComponent>
                <StoreGameCard game={uninstalledGame} />
              </AnimatedComponent>
            </Grid>
          ))}
        {status === 2 && uninstalledList?.length === 0 && (
          <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
            <AnimatedComponent>
              <Stack flexDirection={"column"} justifyContent={"center"}>
                <Box component={"img"} src={NoGamePng} width={"300px"} height={"300px"} alignSelf={"center"} />
                <Box className={"fs-18-regular white"} sx={{ alignSelf: "center", marginTop: "24px" }}>
                  {t("sto-36_no-games")}
                </Box>
              </Stack>
            </AnimatedComponent>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default LibraryShow;
