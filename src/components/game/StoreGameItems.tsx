import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { GameFilterOptionKeys } from "../../const/FilterOptionConsts";

import { Box, Grid, Skeleton, Stack } from "@mui/material";

import StoreGameCard from "./StoreGameCard";
import AnimatedComponent from "../home/AnimatedComponent";
import ReviewPagination from "./ReviewPagination";

import GameAPI from "../../lib/api/GameAPI";

import { IGame } from "../../types/GameTypes";
import { IMetaPagination } from "../../types/APITypes/BasicAPITypes";

import NoGamePng from "../../assets/main/NoGames.png";

export interface IPropsStoreGameItems {
  platform?: string;
  genre?: string;
  releaseDate?: string;
  rank?: string;
  type?: string;
  keyword?: string;
}

const StoreGameItems = ({ platform, genre, type, keyword }: IPropsStoreGameItems) => {
  const { t } = useTranslation();

  const [page, setPage] = useState<number>(1);
  const [gamePagination, setGamePagination] = useState<{ data: IGame[]; meta: IMetaPagination } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePageChange = useCallback(
    (_event: any, value: number) => {
      setPage(value);
      setLoading(true);
      GameAPI.fetchGameList({
        page: value,
        platform: GameFilterOptionKeys[platform],
        genre: GameFilterOptionKeys[genre],
        type: GameFilterOptionKeys[type],
        keyword,
      })
        .then((res) => setGamePagination(res))
        .catch((err) => {
          console.error("Error fetching game list:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [platform, genre, type, keyword]
  );

  useEffect(() => {
    setPage(1);
    setLoading(true);
    GameAPI.fetchGameList({ page: 1, platform: GameFilterOptionKeys[platform], genre: GameFilterOptionKeys[genre], type: GameFilterOptionKeys[type], keyword })
      .then(setGamePagination)
      .catch((err) => {
        console.error("Error fetching game list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [platform, genre, type, keyword]);

  return (
    <Grid item xs={12} container spacing={"32px"} sx={{ width: "100%", marginTop: "0px" }}>
      {loading &&
        Array.from({ length: 10 }).map((_, index) => (
          <Grid key={index} item>
            <Skeleton
              variant="rectangular"
              sx={{
                width: "182px",
                height: "302px !important", // Ensure height is enforced
                minHeight: "302px",
                borderRadius: "16px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            />
          </Grid>
        ))}
      {!loading &&
        gamePagination?.data?.map((game, index) => (
          <Grid key={index} item>
            <AnimatedComponent>
              <StoreGameCard key={`${game?._id}-${index}`} game={game} />
            </AnimatedComponent>
          </Grid>
        ))}
      {!loading && gamePagination?.data?.length === 0 && (
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
    </Grid>
  );
};

export default StoreGameItems;
