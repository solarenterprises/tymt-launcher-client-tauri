import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Box, Grid, Stack } from "@mui/material";

import AnimatedComponent from "../home/AnimatedComponent";
import DeveloperStoreGameCard from "./DeveloperStoreGameCard";

import { getDeveloperGameList } from "../../store/DeveloperGameListSlice";

import { IGameList } from "../../types/GameTypes";

import NoGamePng from "../../assets/main/NoGames.png";

export interface IPropsStoreGameItems {
  platform?: string;
  genre?: string;
  releaseDate?: string;
  rank?: string;
  type?: string;
  keyword?: string;
}

const DeveloperStoreGameCards = () => {
  const { t } = useTranslation();

  const developerGameListStore: IGameList = useSelector(getDeveloperGameList);

  return (
    <Grid item xs={12} container spacing={"32px"} sx={{ width: "100%", marginTop: "0px" }}>
      {developerGameListStore?.games?.map((game, index) => (
        <Grid key={index} item>
          <AnimatedComponent>
            <DeveloperStoreGameCard key={`${game?._id}-${index}`} game={game} isComing={false} />
          </AnimatedComponent>
        </Grid>
      ))}
      {developerGameListStore?.games?.length === 0 && (
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

export default DeveloperStoreGameCards;
