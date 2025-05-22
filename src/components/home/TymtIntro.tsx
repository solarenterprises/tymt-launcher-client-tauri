import { useTranslation } from "react-i18next";
import { Grid, Box } from "@mui/material";

import districteffect from "../../assets/main/DistrictEffect.svg";
import districteffect1 from "../../assets/main/DistrictEffect1.svg";
import districteffect2 from "../../assets/main/DistrictEffect2.svg";

const TymtIntro = () => {
  const { t } = useTranslation();

  return (
    <div style={{ width: "320px" }}>
      <Grid
        sx={{
          borderRadius: "var(--Angle-Number, 16px)",
          flexShrink: "initial",
          backgroundColor: "var(--bg-stroke-side-menu-bg, rgba(29, 29, 29, 0.30))",
          padding: "20px",
          WebkitFlexShrink: "initial",
          position: "relative",
          overflow: "hidden",
        }}
        item
        xs={12}
      >
        <img
          src={districteffect}
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
            zIndex: -1,
          }}
        />
        <img
          src={districteffect1}
          style={{
            position: "absolute",
            left: "0px",
            bottom: "0px",
            zIndex: -1,
          }}
        />
        <img
          src={districteffect2}
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            zIndex: -1,
          }}
        />
        <Box
          className={"fs-38-bold blue"}
          sx={{
            zIndex: 10,
            marginBottom: "12px",
          }}
        >
          {t("tymt")}
        </Box>
        <Box
          className={"fs-16-regular"}
          sx={{
            color: "white",
          }}
        >
          {t("tymt-description")}
        </Box>
      </Grid>
    </div>
  );
};

export default TymtIntro;
