import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Grid, Stack } from "@mui/material";

import StoreGameCard from "../game/StoreGameCard";
import AnimatedComponent from "../home/AnimatedComponent";
import ReviewPagination from "../game/ReviewPagination";

import { useAppSelector } from "../../store";
import { getGameList } from "../../store/GameListSlice";

import GameAPI from "../../lib/api/GameAPI";
import { filterByGenre, filterByKeyword, filterByPlatform, filterByRank, filterByType } from "../../lib/helper/FilterHelper";

import { IGame, IGameList } from "../../types/GameTypes";
import { IMetaPagination } from "../../types/APITypes/BasicAPITypes";

import NoGamePng from "../../assets/main/NoGames.png";

export interface IPropsStoreGameItems {
  platform?: string;
  genre?: string;
  releaseDate?: string;
  rank?: string;
  type?: string;
  keyword?: string;
  status?: number;
}

const StoreComingGameItems = ({ platform, genre, rank, type, keyword, status }: IPropsStoreGameItems) => {
  const { t } = useTranslation();

  const [gamePagination, setGamePagination] = useState<{ data: IGame[]; meta: IMetaPagination } | null>(null);
  const [page, setPage] = useState<number>(1);

  const gameListStore: IGameList = useAppSelector(getGameList);

  const comingGameListStore: IGameList = useMemo(() => {
    const data = gameListStore?.games?.filter((one) => one?.visibilityState === "coming soon");
    const res: IGameList = {
      games: data,
    };
    return res;
  }, [gameListStore]);

  const resultGames: IGame[] = useMemo(() => {
    let data = [...comingGameListStore.games];
    if (platform) data = filterByPlatform(data, platform);
    if (genre) data = filterByGenre(data, genre);
    // if (releaseDate) data = filterByReleaseDate(data, releaseDate);
    if (rank) data = filterByRank(data, rank);
    if (type) data = filterByType(data, type);
    if (keyword) data = filterByKeyword(data, keyword);
    return data;
  }, [comingGameListStore, platform, genre, rank, type, keyword]);

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
    GameAPI.fetchComingSoonGameList({ page: value, limit: 24 }).then((res) => setGamePagination(res));
  };

  useEffect(() => {
    if (status === 3) {
      GameAPI.fetchComingSoonGameList({ page: 1, limit: 24 }).then((res) => setGamePagination(res));
    }
  }, [status]);

  return (
    <Grid item xs={12} container spacing={"32px"} sx={{ width: "100%", marginTop: "0px" }}>
      {status === 0 && (
        <>
          {resultGames?.map((game, index) => (
            <Grid item key={`${game?._id}-${index}`}>
              <AnimatedComponent>
                <StoreGameCard game={game} isComing={comingGameListStore.games.some((element) => element._id === game._id)} />
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
        </>
      )}
      {(status === 3 || status === 2) && (
        <>
          {gamePagination?.data?.map((game, index) => (
            <Grid item key={`${game?._id}-${index}`}>
              <AnimatedComponent>
                <StoreGameCard game={game} isComing={comingGameListStore?.games?.some((element) => element?._id === game?._id)} />
              </AnimatedComponent>
            </Grid>
          ))}
          {gamePagination?.data?.length === 0 && (
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
          <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
            <ReviewPagination totalPage={gamePagination?.meta?.pagination?.pageCount} page={page} handlePageChange={handlePageChange} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default StoreComingGameItems;
