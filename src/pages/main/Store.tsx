import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { Grid, Box, Divider } from "@mui/material";

import MultiChainButton from "../../components/store/MultiChainButton";
import ReleaseButton from "../../components/store/ReleaseButton";
import PlatformButton from "../../components/store/PlatformButton";
import GenreButton from "../../components/store/GenreButton";
import RankingButton from "../../components/store/RankingButton";
import TypeButton from "../../components/store/TypeButton";
import StoreGameItems from "../../components/game/StoreGameItems";
import { FilterOptionNames } from "../../const/FilterOptionNames";

const Store = () => {
  const { t } = useTranslation();

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const keyword = params.get("key");

  const [releaseDate, setReleaseDate] = useState<string>("");
  const [genre, setGenre] = useState<string>(FilterOptionNames.GENRE_ALL);
  const [platform, setPlatform] = useState<string>(FilterOptionNames.PLATFORM_ALL);
  const [rank, setRank] = useState<string>(FilterOptionNames.RANK_ALL);
  const [type, setType] = useState<string>(FilterOptionNames.TYPE_ALL);

  useEffect(() => {
    if (type === FilterOptionNames.TYPE_BROWSER) setPlatform(FilterOptionNames.PLATFORM_ALL);
  }, [type]);

  return (
    <>
      <Grid item xs={12}>
        <Box className={"fs-60-bold white"}>{t("hom-2_store")}</Box>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: "32px",
            paddingTop: "16px",
            paddingBottom: "24px",
          }}
        >
          {false && <ReleaseButton releaseDate={releaseDate} setReleaseDate={setReleaseDate} />}
          {false && <MultiChainButton />}
          <GenreButton genre={genre} setGenre={setGenre} />
          <PlatformButton platform={platform} setPlatform={setPlatform} />
          <RankingButton rank={rank} setRank={setRank} />
          <TypeButton type={type} setType={setType} />
        </Grid>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        container
        sx={{
          display: "flex",
          marginTop: "32px",
        }}
      >
        <StoreGameItems releaseDate={releaseDate} genre={genre} platform={platform} rank={rank} type={type} keyword={keyword} />
      </Grid>
    </>
  );
};

export default Store;
