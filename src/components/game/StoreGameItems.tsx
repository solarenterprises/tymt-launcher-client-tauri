import { useMemo } from "react";

import { Grid } from "@mui/material";

import { CONST_GAME_LIST } from "../../const/games/GameConsts";

import { useAppSelector } from "../../store";
import { getGameList } from "../../store/GameListSlice";

import StoreGameCard from "./StoreGameCard";
import AnimatedComponent from "../home/AnimatedComponent";
import { IGame, IGameList } from "../../types/GameTypes";
import { filterByPlatform, filterByGenre, filterByRank, filterByType, filterByKeyword } from "../../lib/helper/FilterHelper";

export interface IPropsStoreGameItems {
  platform?: string;
  genre?: string;
  releaseDate?: string;
  rank?: string;
  type?: string;
  keyword?: string;
}

const StoreGameItems = ({ platform, genre, rank, type, keyword }: IPropsStoreGameItems) => {
  const gameListStore: IGameList = useAppSelector(getGameList);

  const comingGameListStore: IGameList = useMemo(() => {
    const data = gameListStore?.games?.filter((one) => one?.visibilityState === "coming soon");
    const res: IGameList = {
      games: data,
    };
    return res;
  }, [gameListStore]);

  const allGames: IGame[] = useMemo(() => [...CONST_GAME_LIST, ...gameListStore.games], [gameListStore]);

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
    </Grid>
  );
};

export default StoreGameItems;
