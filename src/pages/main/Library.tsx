import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Box } from "@mui/material";

import LibraryModeButton from "../../components/library/LibraryMode";
import MultiChainButton from "../../components/store/MultiChainButton";
import LibraryShow from "../../components/library/LibraryShow";
import StoreComingGameItems from "../../components/store/StoreComingGameItems";

const Library = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<number>(0);

  return (
    <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
      <Box className={"fs-60-bold white"}>{t("hom-3_library")}</Box>
      <Grid item xs={12} container display={"flex"} marginTop={"48px"} justifyContent={"space-between"}>
        <LibraryModeButton status={status} setStatus={setStatus} />
        {false && <MultiChainButton />}
      </Grid>
      <Grid item xs={12} marginTop={"32px"}>
        <LibraryShow status={status} />
        {status === 3 && <StoreComingGameItems />}
      </Grid>
    </Grid>
  );
};

export default Library;
