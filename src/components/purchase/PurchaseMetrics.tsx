import { useTranslation } from "react-i18next";
import { Box, Skeleton, Stack } from "@mui/material";
import { IPurchaseHistory } from "../../types/APITypes/PurchaseAPITypes";
import { IMetaPagination } from "../../types/APITypes/BasicAPITypes";
import { useWallet } from "../../providers/WalletProvider";
import numeral from "numeral";

export interface IPropsPurchaseMetrics {
  loading: boolean;
  historyPagination: { data: IPurchaseHistory[]; meta: IMetaPagination };
}

const PurchaseMetrics = ({ loading, historyPagination }: IPropsPurchaseMetrics) => {
  const { t } = useTranslation();
  const { sxpPrice } = useWallet();
  return (
    <>
      <Stack padding={"24px 40px"}>
        <Box className="fs-16-regular light t-center">{`Total Items`}</Box>
        <Box className="fs-34-bold white t-center">
          {loading || !historyPagination?.meta?.pagination?.total ? <Skeleton /> : `${historyPagination?.meta?.pagination?.total} Items`}
        </Box>
      </Stack>
      <Stack padding={"32px 24px"}>
        <Box
          sx={{
            borderRight: "1px solid #FFFFFF1A",
            height: "68px",
          }}
        />
      </Stack>

      <Stack padding={"24px 40px"}>
        <Box className="fs-16-regular light t-center">{`Total Spent SXP`}</Box>

        <Box className="fs-34-bold white t-center">
          {loading || !historyPagination?.meta?.pagination?.pageCount ? <Skeleton /> : `${historyPagination?.meta?.pagination?.pageCount}`}
        </Box>
      </Stack>
      <Stack padding={"32px 24px"}>
        <Box
          sx={{
            borderRight: "1px solid #FFFFFF1A",
            height: "68px",
          }}
        />
      </Stack>

      <Stack padding={"24px 40px"}>
        <Box className="fs-16-regular light t-center">{`Total Spent USD`}</Box>
        <Box className="fs-34-bold beach t-center">
          {loading || !historyPagination?.meta?.pagination?.pageCount ? (
            <Skeleton />
          ) : (
            `${numeral(historyPagination?.meta?.pagination?.pageCount * sxpPrice).format("0,0.00")} USD`
          )}
        </Box>
      </Stack>
    </>
  );
};

export default PurchaseMetrics;
