import { Suspense } from "react";
import numeral from "numeral";

import { Stack, Box, Button, CircularProgress, Pagination } from "@mui/material";

import { useWallet } from "../../providers/WalletProvider";

import TooltipComponent from "../home/TooltipComponent";

import { formatTx } from "../../lib/helper/WalletHelper";

import { ITransactionPagination } from "../../types/TransactionTypes";

import timerIcon from "../../assets/wallet/TimerIcon.svg";

export interface IPropsTransCard {
  loading: boolean;
  txList: ITransactionPagination;
  currentTxPage: number;
  setCurrentTxPage: (_: number) => void;
}

const TransCard = ({ loading, txList, currentTxPage, setCurrentTxPage }: IPropsTransCard) => {
  const { currentChainWalletAddress, currentNativeOrToken, currentCurrencySymbol, currentCurrencyReserve, currentChainNativePrice } = useWallet();

  const handlePageChange = async (_event: any, value: number) => {
    setCurrentTxPage(value);
  };

  return (
    <Suspense>
      {loading ? (
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
      ) : (
        <Box>
          {txList?.data?.map((tx, index) => {
            const { displayTxImage, displayTxAmount, displayTxAddress, displayTxTooltip, displayTimestamp } = formatTx(tx, currentChainWalletAddress);
            return (
              <TooltipComponent placement="bottom" text={displayTxTooltip}>
                <Button
                  key={`${index}-${new Date().toISOString()}`}
                  sx={{
                    textTransform: "none",
                    width: "100%",
                  }}
                  onDoubleClick={() => {}}
                >
                  <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} padding={"7px 25px"} width={"100%"}>
                    <Stack direction={"row"} spacing={"16px"} alignItems={"center"}>
                      <Box component={"img"} src={displayTxImage} width={"32px"} height={"32px"} />
                      <Stack>
                        <Box className={"fs-16-regular white"}>
                          {displayTxAddress?.substring(0, 6)}...
                          {displayTxAddress?.substring(tx?.sender?.length - 10)}
                        </Box>
                        <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                          <Box component={"img"} src={timerIcon} width={"12px"} height={"12px"} />
                          <Box className={"fs-12-regular light"}>{displayTimestamp}</Box>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Stack>
                      <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
                        <Box component={"img"} src={currentNativeOrToken.logo} width={"24px"} height={"24px"}></Box>
                        <Box className={"fs-16-regular white center-align"}>{`${displayTxAmount} ${currentNativeOrToken.symbol}`}</Box>
                      </Stack>
                      <Box className={"fs-12-light light t-right"}>{`${currentCurrencySymbol} ${numeral(
                        displayTxAmount * currentChainNativePrice * currentCurrencyReserve
                      ).format("0,0.[00]")}`}</Box>
                    </Stack>
                  </Stack>
                </Button>
              </TooltipComponent>
            );
          })}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Pagination
              count={txList?.meta?.pageCount}
              page={currentTxPage}
              onChange={handlePageChange}
              shape="rounded"
              sx={{
                marginTop: "20px",
                "& .MuiPaginationItem-root": {
                  borderRadius: "6px",
                  fontFamily: "Cobe",
                  color: "#AFAFAF",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  color: "white",
                  backgroundColor: "#232B2C",
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Suspense>
  );
};

export default TransCard;
