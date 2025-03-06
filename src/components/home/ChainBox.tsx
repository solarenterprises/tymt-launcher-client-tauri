import { useMemo } from "react";
import { useSelector } from "react-redux";

import { Box, Button, Stack } from "@mui/material";

import { useWallet } from "../../providers/WalletProvider";

import { getWallet } from "../../store/WalletSlice";
import { getPriceList } from "../../store/PriceListSlice";
import { getBalanceList } from "../../store/BalanceListSlice";
import { getCurrentChain } from "../../store/CurrentChainSlice";

import { formatBalance } from "../../lib/helper/NumberHelper";
import { getCurrentChainWalletAddress, getTokenBalanceBySymbol, getTokenPriceBySymbol } from "../../lib/helper/WalletHelper";

import { IPriceList } from "../../types/PriceTypes";
import { ICurrentChain, ISupportChain } from "../../types/ChainTypes";
import { IBalanceList, IWalletAddresses } from "../../types/WalletTypes";
import { CONST_CHAIN_NAMES } from "../../const/ChainConsts";

export interface IPropsChainBox {
  supportChain: ISupportChain;
  onClick: () => void;
}

const ChainBox = ({ supportChain, onClick }: IPropsChainBox) => {
  const { currentCurrencyReserve, currentCurrencySymbol } = useWallet();

  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const walletStore: IWalletAddresses = useSelector(getWallet);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const priceListStore: IPriceList = useSelector(getPriceList);

  const isActive: boolean = useMemo(() => currentChainStore?.chain === supportChain?.native?.name, [currentChainStore]);
  const balance = useMemo(() => getTokenBalanceBySymbol(balanceListStore, supportChain?.native?.symbol) ?? 0, [balanceListStore]);
  const price = useMemo(() => getTokenPriceBySymbol(priceListStore, supportChain?.native?.symbol) ?? 0, [priceListStore]);

  return (
    <Button
      onClick={onClick}
      className={`common-btn ${isActive ? `active` : null}`}
      sx={{
        display: "block",
        textTransform: "none",
        filter: supportChain?.native?.name === CONST_CHAIN_NAMES?.BITCOIN || supportChain?.native?.name === CONST_CHAIN_NAMES?.SOLANA ? "grayscale(1.0)" : "",
      }}
      disabled={supportChain?.native?.name === CONST_CHAIN_NAMES?.BITCOIN || supportChain?.native?.name === CONST_CHAIN_NAMES?.SOLANA}
    >
      <Stack direction={"row"} justifyContent={"space-between"} sx={{ padding: "20px" }}>
        <Stack gap={2} direction={"row"} justifyContent={"flex-start"}>
          <Box component={"img"} src={supportChain?.native?.logo} width={"32px"} height={"32px"} />
          <Stack direction={"column"} alignItems={"flex-start"} textAlign={"center"} justifyContent={"space-between"} gap={"5px"}>
            <Box className="fs-h5 white">{supportChain?.native?.name}</Box>
            <Box className="fs-12-light blue">{getCurrentChainWalletAddress(walletStore, supportChain?.native?.name)}</Box>
          </Stack>
        </Stack>
        <Stack direction={"column"} alignItems={"flex-end"} gap={"5px"} justifyContent={"space-between"}>
          <Box className="fs-18-light white">{formatBalance(balance, 4)}</Box>
          <Box className="fs-12-light gray">{`${currentCurrencySymbol} ${formatBalance(Number(price) * Number(balance) * currentCurrencyReserve)}`}</Box>
        </Stack>
      </Stack>
    </Button>
  );
};

export default ChainBox;
