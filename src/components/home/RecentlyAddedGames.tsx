import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Box } from "@mui/material";

import AnimatedComponent from "./AnimatedComponent";
import StoreGameCard from "../game/StoreGameCard";

import { useAppSelector } from "../../store";
import { getGameList } from "../../store/GameListSlice";
import { IGameList, IGame } from "../../types/GameTypes";

const RecentlyAddedGames = () => {
  const { t } = useTranslation();

  const gameListStore: IGameList = useAppSelector(getGameList);

  const activeGameList: IGame[] = useMemo(() => gameListStore?.games?.filter((one) => one?.visibilityState === "active"), [gameListStore]);
  const displayGameList: IGame[] = useMemo(() => [...activeGameList], [activeGameList]);

  return (
    <>
      <Grid item xs={12} container sx={{ position: "relative" }}>
        <Grid container sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
            {t("hom-10_recently-added")}
          </Box>
        </Grid>
        <Grid container sx={{ width: "100%", marginTop: "0px" }} spacing={"32px"}>
          {displayGameList?.map((game, index) => (
            <Grid item key={index}>
              <AnimatedComponent>
                <StoreGameCard game={game} isComing={false} />
              </AnimatedComponent>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default RecentlyAddedGames;
