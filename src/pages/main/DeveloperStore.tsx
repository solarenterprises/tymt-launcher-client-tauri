import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Box } from "@mui/material";

import DeveloperStoreGameCards from "../../components/developer/DeveloperStoreGameCards";
import DeveloperSwitchButton from "../../components/developer/DeveloperSwitchButton";
import DeveloperNewGame from "./DeveloperNewGame";

const DeveloperStore = () => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
        <Box className={"fs-60-bold white"}>{t("sto-55_developer-store")}</Box>
        <Grid item xs={12} container display={"flex"} marginTop={"48px"} justifyContent={"space-between"}>
          <DeveloperSwitchButton status={status} setStatus={setStatus} />
        </Grid>
        <Grid item xs={12} marginTop={"32px"}>
          {status === 0 && <DeveloperStoreGameCards />}
          {status === 1 && <DeveloperNewGame setStatus={setStatus} />}
        </Grid>
      </Grid>
    </>
  );
};

export default DeveloperStore;
