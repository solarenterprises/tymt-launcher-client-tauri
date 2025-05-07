import { useTranslation } from "react-i18next";
import { Box, Button, CircularProgress, Grid, Stack } from "@mui/material";
import numeral from "numeral";
import { format } from "date-fns";
import { CONFIG_SOLAR_SCAN } from "../../config/MainConfig";
import { CONST_CHAIN_ICONS } from "../../const/ChainConsts";
import AnimatedComponent from "../home/AnimatedComponent";
import TooltipComponent from "../home/TooltipComponent";
import { openLink } from "../../lib/helper/TauriHelper";
import { IPurchaseHistory } from "../../types/APITypes/PurchaseAPITypes";
import { IMetaPurchasePagination } from "../../types/APITypes/BasicAPITypes";
import NoGamePng from "../../assets/main/NoGames.png";

export interface IPropsPurchaseTable {
  loading: boolean;
  historyPagination: { data: IPurchaseHistory[]; meta: IMetaPurchasePagination };
}

const PurchaseTable = ({ loading, historyPagination }: IPropsPurchaseTable) => {
  const { t } = useTranslation();

  const formatDate = (isoDate: string): string => {
    return format(new Date(isoDate), "d MMMM, yyyy");
  };

  const renderLoader = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "150px 0",
      }}
    >
      <CircularProgress
        size="100px"
        sx={{
          color: "#afafaf",
        }}
      />
    </Box>
  );
  const renderNoPurchase = () => (
    <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
      <AnimatedComponent>
        <Stack flexDirection={"column"} justifyContent={"center"}>
          <Box component={"img"} src={NoGamePng} width={"300px"} height={"300px"} alignSelf={"center"} />
          <Box className={"fs-18-regular white"} sx={{ alignSelf: "center", marginTop: "24px" }}>
            {t("pur-16_no-purchase-history")}
          </Box>
        </Stack>
      </AnimatedComponent>
    </Grid>
  );

  const getSolarScanLink = (history: IPurchaseHistory) => {
    return `${CONFIG_SOLAR_SCAN}transaction/${history?.tx_hash}`;
  };

  const handleButtonClick = (history: IPurchaseHistory) => {
    const url = getSolarScanLink(history);
    openLink(url);
  };

  return loading ? (
    renderLoader()
  ) : historyPagination?.data.length > 0 ? (
    <Stack display={"flex"} flexDirection={"column"} alignItems={"center"} spacing={"-1px"}>
      {historyPagination?.data?.map((history, index) => (
        <TooltipComponent text={t("pur-6_double-click-detail")} placement="bottom" key={history?.game_id}>
          <Button
            sx={{
              border: "1px solid #FFFFFF1A",
              borderRadius:
                historyPagination?.data?.length === 1
                  ? "16px"
                  : index === 0
                  ? "16px 16px 0 0"
                  : index === historyPagination.data.length - 1
                  ? "0 0 16px 16px"
                  : "0",
              width: "100%",
              backgroundColor: "transparent",
              textTransform: "none",
            }}
            onDoubleClick={() => handleButtonClick(history)}
          >
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              padding={"16px 24px"}
              width={"520px"}
              key={history?.game_id}
            >
              <Stack display={"flex"} flexDirection={"row"} alignItems={"center"} gap={"16px"}>
                <Box component={"img"} src={history?.game_imageUrl} width={"60px"} height={"40px"} borderRadius={"4px"} />
                <Stack display={"flex"} flexDirection={"column"} alignItems={"flex-start"} gap={"4px"}>
                  <Box key={history?.game_id} className={"fs-20-regular white"}>
                    {history?.game_title}
                  </Box>
                  <Box key={history?.game_id} className={"fs-14-regular light"}>
                    {formatDate(history?.date)}
                  </Box>
                </Stack>
              </Stack>

              <Stack display={"flex"} flexDirection={"row"} alignItems={"center"} gap={"8px"}>
                <Box component={"img"} src={CONST_CHAIN_ICONS.SOLAR} width={"24px"} height={"24px"} />
                <Box className={"fs-20-regular white"}>{numeral(history?.price).format("0,0.0")}</Box>
              </Stack>
            </Stack>
          </Button>
        </TooltipComponent>
      ))}
    </Stack>
  ) : (
    renderNoPurchase()
  );
};

export default PurchaseTable;
