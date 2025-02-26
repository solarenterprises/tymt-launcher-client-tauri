import { useState, Suspense, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

import { Stack, Box, Button, CircularProgress } from "@mui/material";

import tymtCore from "../../lib/core/tymtCore";
import { useWallet } from "../../providers/WalletProvider";

import { getWallet } from "../../store/WalletSlice";

import { formatTx } from "../../lib/helper/WalletHelper";

import { IWalletAddresses } from "../../types/WalletTypes";
import { ITransactionPagination } from "../../types/TransactionTypes";

import timerIcon from "../../assets/wallet/TimerIcon.svg";
import TooltipComponent from "../home/TooltipComponent";

const TransCard = () => {
  const { t } = useTranslation();

  const walletStore: IWalletAddresses = useSelector(getWallet);

  //@ts-ignore
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionList, setTransactionList] = useState<ITransactionPagination>();

  const { currentChainWalletAddress, currentNativeOrToken, currentCurrencySymbol, currentCurrencyReserve, currentChainNativePrice } = useWallet();

  useEffect(() => {
    fetchTransactionList(page);
  }, [page]);

  const fetchTransactionList = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const res = await tymtCore.Blockchains.solar.wallet.getTransactions(walletStore?.solar, page, 100);
        setTransactionList(res);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [walletStore]
  );

  return (
    <Suspense>
      <Box>
        {transactionList?.data?.map((tx, index) => {
          const { displayTxImage, displayTxAmount, displayTxAddress, displayTxTooltip } = formatTx(tx, currentChainWalletAddress);
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
                        <Box className={"fs-12-regular light"}>{tx?.timestamp}</Box>
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
      </Box>
    </Suspense>
  );
};

export default TransCard;
