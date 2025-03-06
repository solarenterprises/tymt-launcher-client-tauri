import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Stack, Box, Button } from "@mui/material";

import { useWallet } from "../../providers/WalletProvider";

import QrModal from "./QrModal";

import { setCurrentChain } from "../../store/CurrentChainSlice";
import { getBalanceList } from "../../store/BalanceListSlice";
import { getPriceList } from "../../store/PriceListSlice";

import { getTokenBalanceBySymbol, getTokenPriceBySymbol } from "../../lib/helper/WalletHelper";
import { formatBalance } from "../../lib/helper/NumberHelper";

import { ISupportChain } from "../../types/ChainTypes";
import { IBalanceList } from "../../types/WalletTypes";
import { IPriceList } from "../../types/PriceTypes";

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
import { useNotification } from "../../providers/NotificationProvider";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";
import { CONST_CHAIN_NAMES } from "../../const/ChainConsts";
import TooltipComponent from "../home/TooltipComponent";

const backgrounds = [walletImg1, walletImg2, walletImg3, walletImg4, walletImg5, walletImg6, walletImg7, walletImg8, walletImg9];

export interface IPropsWalletCard {
  supportChain: ISupportChain;
  index: number;
  setLoading: (_: boolean) => void;
}

const WalletCard = ({ supportChain, index }: IPropsWalletCard) => {
  const dispatch = useDispatch();
  const { currentCurrencyReserve, currentCurrencySymbol } = useWallet();
  const { showNotification } = useNotification();

  const background = backgrounds[index];

  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const priceListStore: IPriceList = useSelector(getPriceList);

  const balance = useMemo(() => getTokenBalanceBySymbol(balanceListStore, supportChain?.native?.symbol), [balanceListStore]);
  const price = useMemo(() => getTokenPriceBySymbol(priceListStore, supportChain?.native?.symbol), [priceListStore]);

  const [open, setOpen] = useState(false);

  const handleWalletCardClick = () => {
    try {
      dispatch(setCurrentChain(supportChain?.native?.name));
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.CHAIN_SELECT_SUCCESS, text: supportChain?.native?.name });
    } catch (err) {
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.CHAIN_SELECT_FAIL, text: supportChain?.native?.name });
    }
  };

  const buttonRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    if (buttonRef.current) {
      const observer = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          setButtonWidth(entries[0].contentRect.width);
        }
      });
      observer.observe(buttonRef.current);
      return () => {
        if (buttonRef.current) observer.unobserve(buttonRef.current);
      };
    }
  }, [buttonRef]);

  return (
    <>
      <TooltipComponent placement="bottom" text={"Click to switch the network"}>
        <div>
          <Button
            fullWidth
            ref={buttonRef}
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
              filter:
                supportChain?.native?.name === CONST_CHAIN_NAMES?.BITCOIN || supportChain?.native?.name === CONST_CHAIN_NAMES?.SOLANA ? "grayscale(1.0)" : "",
            }}
            onClick={handleWalletCardClick}
            disabled={supportChain?.native?.name === CONST_CHAIN_NAMES?.BITCOIN || supportChain?.native?.name === CONST_CHAIN_NAMES?.SOLANA}
          >
            <Stack direction={"row"} gap={3} justifyContent={"space-between"} width={"100%"}>
              <Stack direction={"row"} justifyContent={"flex-start"} gap={"16px"} width={"75%"}>
                <Box component={"img"} src={supportChain?.native?.logo} width={"40px"} height={"40px"} />
                <Stack gap={1}>
                  <Box
                    className={"fs-h3 white t-left"}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: `calc(${buttonWidth}px - 120px)`,
                    }}
                  >
                    {supportChain?.native?.name}
                  </Box>
                  <Box className={"fs-18-regular white"}>{`${formatBalance(balance, 4)} ${supportChain?.native?.symbol}`}</Box>
                  <Box className={"fs-16-regular light t-left"}>{`${currentCurrencySymbol} ${formatBalance(
                    Number(price ?? 0) * Number(balance ?? 0) * currentCurrencyReserve
                  )}`}</Box>
                </Stack>
              </Stack>
              <Box
                className={`qr-btn`}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  width: "40px",
                }}
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
        </div>
      </TooltipComponent>
      <QrModal supportChain={supportChain} open={open} setOpen={setOpen} />
    </>
  );
};

export default WalletCard;
