import { useTranslation } from "react-i18next";
import { Box, Stack } from "@mui/material";
import AnimatedComponent from "../home/AnimatedComponent";

import NoGamePng from "../../assets/main/NoGames.png";

const ErrorComponent = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: "32px",
        padding: "24px",
      }}
    >
      <AnimatedComponent>
        <Stack flexDirection={"column"} justifyContent={"center"}>
          <Box component={"img"} src={NoGamePng} width={"300px"} height={"300px"} alignSelf={"center"} />
          <Box className={"fs-18-regular white"} sx={{ alignSelf: "center", marginTop: "24px" }}>
            {t("sto-36_no-games")}
          </Box>
        </Stack>
      </AnimatedComponent>
    </Box>
  );
};

export default ErrorComponent;
