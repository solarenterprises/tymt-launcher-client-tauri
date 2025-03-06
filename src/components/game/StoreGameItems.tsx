import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Box, Grid, Stack } from "@mui/material";

import { useAppSelector } from "../../store";
import { getGameList } from "../../store/GameListSlice";

import StoreGameCard from "./StoreGameCard";
import AnimatedComponent from "../home/AnimatedComponent";

import { filterByPlatform, filterByGenre, filterByRank, filterByType, filterByKeyword } from "../../lib/helper/FilterHelper";

import { IGame, IGameList } from "../../types/GameTypes";

import NoGamePng from "../../assets/main/NoGames.png";

export interface IPropsStoreGameItems {
  platform?: string;
  genre?: string;
  releaseDate?: string;
  rank?: string;
  type?: string;
  keyword?: string;
}

const StoreGameItems = ({ platform, genre, rank, type, keyword }: IPropsStoreGameItems) => {
  const { t } = useTranslation();
  const gameListStore: IGameList = useAppSelector(getGameList);

  const comingGameListStore: IGameList = useMemo(() => {
    const data = gameListStore?.games?.filter((one) => one?.visibilityState === "coming soon");
    const res: IGameList = {
      games: data,
    };
    return res;
  }, [gameListStore]);

  const allGames: IGame[] = useMemo(() => [...gameListStore.games], [gameListStore]);

  const resultGames: IGame[] = useMemo(() => {
    let data = [...allGames];
    if (platform) data = filterByPlatform(data, platform);
    if (genre) data = filterByGenre(data, genre);
    // if (releaseDate) data = filterByReleaseDate(data, releaseDate);
    if (rank) data = filterByRank(data, rank);
    if (type) data = filterByType(data, type);
    if (keyword) data = filterByKeyword(data, keyword);
    return data;
  }, [platform, genre, rank, type, keyword]);

  return (
    <Grid item xs={12} container spacing={"32px"} sx={{ width: "100%", marginTop: "0px" }}>
      {resultGames?.map((game, index) => (
        <Grid key={index} item>
          <AnimatedComponent>
            <StoreGameCard key={`${game?._id}-${index}`} game={game} isComing={comingGameListStore.games.some((element) => element._id === game._id)} />
          </AnimatedComponent>
        </Grid>
      ))}
      {resultGames?.length === 0 && (
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
  );
};

export default StoreGameItems;
