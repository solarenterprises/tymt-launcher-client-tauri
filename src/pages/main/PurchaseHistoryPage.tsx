import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import ReviewPagination from "../../components/game/ReviewPagination";
import GameAPI from "../../lib/api/GameAPI";
import { IPurchaseHistory } from "../../types/APITypes/PurchaseAPITypes";
import { IMetaPagination } from "../../types/APITypes/BasicAPITypes";
import PurchaseTable from "../../components/purchase/PurchaseTable";
import PurchaseMetrics from "../../components/purchase/PurchaseMetrics";

const PurchaseHistoryPage = () => {
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

  useEffect(() => {
    console.log(historyPagination);
  }, [historyPagination]);

  return (
    <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
      <Box className={"fs-60-bold white"} mb={"24px"}>
        Your Purchase History
      </Box>
      <Box className="fs-16-regular light" mb={"12px"}>{`Confirm your purchase history here`}</Box>
      <Grid item xs={12} container justifyContent={"center"}>
        <PurchaseMetrics loading={loading} historyPagination={historyPagination} />
      </Grid>
      <Grid item xs={12} container justifyContent={"center"} marginTop={"12px"}>
        <PurchaseTable loading={loading} historyPagination={historyPagination} />
      </Grid>
      <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
        <ReviewPagination totalPage={historyPagination?.meta?.pagination?.pageCount} page={page} handlePageChange={handlePageChange} />
      </Grid>
    </Grid>
  );
};

export default PurchaseHistoryPage;
