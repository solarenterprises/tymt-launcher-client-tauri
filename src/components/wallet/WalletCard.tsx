import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Stack, Box, Button } from "@mui/material";

import { useWallet } from "../../providers/WalletProvider";

import QrModal from "./QrModal";

import { setCurrentChain } from "../../store/CurrentChainSlice";
import { getBalanceList } from "../../store/BalanceListSlice";
import { getPriceList } from "../../store/PriceListSlice";

import { getTokenBalanceBySymbol, getTokenPriceByCmc } from "../../lib/helper/WalletHelper";
import { formatBalance } from "../../lib/helper/NumberHelper";

import { ISupportChain } from "../../types/ChainTypes";
import { IBalanceList } from "../../types/WalletTypes";
import { IPriceList } from "../../types/PriceTypes";

import CommonStyles from "../../styles/commonStyles";

import walletImg1 from "../../assets/wallet/WalletCard1.png";
import walletImg2 from "../../assets/wallet/WalletCard2.png";
import walletImg3 from "../../assets/wallet/WalletCard3.png";
import walletImg4 from "../../assets/wallet/WalletCard4.png";
import walletImg5 from "../../assets/wallet/WalletCard5.png";
import walletImg6 from "../../assets/wallet/WalletCard6.png";
import walletImg7 from "../../assets/wallet/WalletCard7.png";
import walletImg8 from "../../assets/wallet/WalletCard8.png";
import walletImg9 from "../../assets/wallet/WalletCard9.png";
import qrIcon from "../../assets/wallet/QrIcon.svg";

const backgrounds = [walletImg1, walletImg2, walletImg3, walletImg4, walletImg5, walletImg6, walletImg7, walletImg8, walletImg9];

export interface IPropsWalletCard {
  supportChain: ISupportChain;
  index: number;
  setLoading: (_: boolean) => void;
}

const WalletCard = ({ supportChain, index }: IPropsWalletCard) => {
  const dispatch = useDispatch();
  const { currentCurrencyReserve, currentCurrencySymbol } = useWallet();

  const background = backgrounds[index];
  const common = CommonStyles();

  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const priceListStore: IPriceList = useSelector(getPriceList);

  const balance = useMemo(() => getTokenBalanceBySymbol(balanceListStore, supportChain?.native?.symbol), [balanceListStore]);
  const price = useMemo(() => getTokenPriceByCmc(priceListStore, supportChain?.native?.cmc), [priceListStore]);

  const [open, setOpen] = useState(false);

  const handleWalletCardClick = () => {
    dispatch(setCurrentChain(supportChain?.native?.name));
  };

  return (
    <>
      <Button
        fullWidth
        sx={{
          textTransform: "none",
          borderRadius: "16px",
          padding: "20px",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${background})`,
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
        onClick={handleWalletCardClick}
      >
        <Stack direction={"row"} gap={3} justifyContent={"space-between"} width={"100%"}>
          <Stack direction={"row"} justifyContent={"flex-start"} gap={"16px"}>
            <Box component={"img"} src={supportChain?.native?.logo} width={"40px"} height={"40px"} />
            <Stack gap={1}>
              <Box className={"fs-h3 white t-left"}>{supportChain?.native?.name}</Box>
              <Box className={"fs-18-regular white"}>{`${formatBalance(balance, 4)} ${supportChain?.native?.symbol}`}</Box>
              <Box className={"fs-16-regular light t-left"}>{`${currentCurrencySymbol} ${formatBalance(
                Number(price ?? 0) * Number(balance ?? 0) * currentCurrencyReserve
              )}`}</Box>
            </Stack>
          </Stack>
          <Box
            className={`${common.center_align} qr-btn`}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <img src={qrIcon} />
          </Box>
        </Stack>
      </Button>
      <QrModal supportChain={supportChain} open={open} setOpen={setOpen} />
    </>
  );
};

export default WalletCard;
