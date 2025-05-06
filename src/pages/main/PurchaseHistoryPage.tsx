import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import numeral from "numeral";
import { format } from "date-fns";
import { Grid, Box, CircularProgress, Stack } from "@mui/material";
import AnimatedComponent from "../../components/home/AnimatedComponent";
import ReviewPagination from "../../components/game/ReviewPagination";
import GameAPI from "../../lib/api/GameAPI";
import { IPurchaseHistory } from "../../types/APITypes/PurchaseAPITypes";
import { IMetaPagination } from "../../types/APITypes/BasicAPITypes";
import NoGamePng from "../../assets/main/NoGames.png";
import { CONST_CHAIN_ICONS } from "../../const/ChainConsts";

const PurchaseHistoryPage = () => {
  const { t } = useTranslation();

  const [historyPagination, setHistoryPagination] = useState<{ data: IPurchaseHistory[]; meta: IMetaPagination }>(null);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHistory = (page: number) => {
    setLoading(true);
    GameAPI.fetchPurchaseHistory({ page })
      .then(setHistoryPagination)
      .catch((err) => {
        console.error("Error fetching purchase history:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value);
    fetchHistory(value);
  };

  useEffect(() => {
    setPage(1);
    fetchHistory(1);
  }, []);

  const formatDate = (isoDate: string): string => {
    return format(new Date(isoDate), "d MMMM, yyyy");
  };

  useEffect(() => {
    console.log(historyPagination);
  }, [historyPagination]);

  const renderLoader = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Optional for vertical alignment
        width: "100%", // Fill the parent width
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
            {t("sto-36_no-games")}
          </Box>
        </Stack>
      </AnimatedComponent>
    </Grid>
  );

  return (
    <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
      <Box className={"fs-60-bold white"} marginBottom={"60px"}>
        Your Purchase History
      </Box>
      <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
        {loading ? (
          renderLoader()
        ) : historyPagination?.data.length > 0 ? (
          <Stack display={"flex"} flexDirection={"column"} alignItems={"center"} spacing={2}>
            {historyPagination.data.map((history) => (
              <Stack
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                padding={"16px 24px"}
                width={"410px"}
                key={history?.game_id}
              >
                <Stack display={"flex"} flexDirection={"row"} alignItems={"center"} gap={"8px"}>
                  <Box component={"img"} src={history?.game_imageUrl} width={"60px"} height={"40px"} borderRadius={"16px"} />
                  <Stack display={"flex"} flexDirection={"column"} gap={"4px"}>
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
            ))}
          </Stack>
        ) : (
          renderNoPurchase()
        )}
      </Grid>
      <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
        <ReviewPagination totalPage={historyPagination?.meta?.pagination?.pageCount} page={page} handlePageChange={handlePageChange} />
      </Grid>
    </Grid>
  );
};

export default PurchaseHistoryPage;
