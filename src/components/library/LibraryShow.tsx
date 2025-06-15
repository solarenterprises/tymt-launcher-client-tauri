import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Box, Stack, Skeleton } from "@mui/material";

import AnimatedComponent from "../home/AnimatedComponent";
import StoreGameCard from "../game/StoreGameCard";
import ReviewPagination from "../game/ReviewPagination";

import GameAPI from "../../lib/api/GameAPI";

import NoGamePng from "../../assets/main/NoGames.png";

import { IGame } from "../../types/GameTypes";
import { IMetaPagination } from "../../types/APITypes/BasicAPITypes";
import { isInstalled } from "../../lib/helper/DownloadHelper";

export interface IPropsLibraryShow {
  status: number;
}

const LibraryShow = ({ status }: IPropsLibraryShow) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [gamePagination, setGamePagination] = useState<{ data: IGame[]; meta: IMetaPagination } | null>(null);
  const [page, setPage] = useState<number>(1);

  // Map status to API calls and titles
  const statusConfig = {
    0: {
      fetchGames: GameAPI.fetchGameList,
      title: t("lib-1_your-games"),
    },
    2: {
      fetchGames: GameAPI.fetchGameList,
      title: t("lib-3_download"),
    },
    3: {
      fetchGames: GameAPI.fetchComingSoonGameList,
      title: t("lib-5_coming"),
    },
  };

  const fetchGames = useCallback(
    async (page: number) => {
      const config = statusConfig[status];
      if (!config) return;
  
      setLoading(true);
      try {
        const result = await config.fetchGames({ page });
        if (status === 0) {
          const downloaded = await Promise.all(
            result.data.map(async (game) => {
              const installed = await isInstalled(game);
              return installed ? game : null;
            })
          );
          const filteredGames = downloaded.filter((game): game is IGame => game !== null);
          setGamePagination({
            data: filteredGames,
            meta: result.meta
          });
        } else {
          setGamePagination(result);
        }
      } catch (err) {
        console.error("Error fetching game list:", err);
      } finally {
        setLoading(false);
      }
    },
    [status]
  );

  const handlePageChange = useCallback(
    (_event: any, value: number) => {
      setPage(value);
      fetchGames(value);
    },
    [fetchGames]
  );

  useEffect(() => {
    setPage(1);
    fetchGames(1);
  }, [status, fetchGames]);

  const renderSkeletons = () =>
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
    ));

  const renderNoGames = () => (
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
  );

  useEffect(() => {
    console.log(gamePagination?.data);
  }, [gamePagination]);

  return (
    <>
      <Grid item xs={12}>
        <Box className={"fs-40-bold white"}>{statusConfig[status]?.title}</Box>
      </Grid>
      <Grid item xs={12} container spacing={"32px"} mt={"32px"}>
        {loading
          ? renderSkeletons()
          : !gamePagination?.data?.length
          ? renderNoGames()
          : gamePagination?.data
              ?.filter((game) => game)
              .map((game, index) => (
                <Grid item key={index}>
                  <AnimatedComponent>
                    <StoreGameCard game={game} />
                  </AnimatedComponent>
                </Grid>
              ))}
        <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
          <ReviewPagination totalPage={gamePagination?.meta?.pagination?.pageCount} page={page} handlePageChange={handlePageChange} />
        </Grid>
      </Grid>
    </>
  );
};

export default LibraryShow;
