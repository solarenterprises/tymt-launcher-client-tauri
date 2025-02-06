import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import SwitchComp from "../../components/home/SwitchComp";

import { getCurrentChain } from "../../store/CurrentChainSlice";
import { getCurrentCurrency } from "../../store/CurrentCurrencySlice";
import { getWalletSetting, setWalletSetting } from "../../store/WalletSettingSlice";

import { IWalletSetting } from "../../types/SettingTypes";
import { ICurrentCurrency } from "../../types/CurrencyTypes";

import { ICurrentChain } from "../../types/ChainTypes";
import backIcon from "../../assets/setting/BackIcon.svg";
import arrowImg from "../../assets/setting/ArrowRight.svg";

interface IPropsWallet {
  view: string;
  setView: (panel: string) => void;
}

const Wallet: FC<IPropsWallet> = ({ view, setView }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);

  const handleHideZeroBalanceClick = useCallback(() => {
    dispatch(
      setWalletSetting({
        ...walletSettingStore,
        hideZeroBalance: !walletSettingStore?.hideZeroBalance,
      })
    );
  }, [walletSettingStore]);

  return (
    <>
      {view === "wallet" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-28_wallet-settings")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"left"} gap={1}>
                <Box className="fs-h5 white">{t("set-29_hide-0-balance")}</Box>
                <Box
                  className="fs-14-regular gray"
                  sx={{
                    whiteSpace: "normal",
                  }}
                >
                  {t("set-29_hide-0-balance")}
                </Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1}>
                <SwitchComp
                  checked={walletSettingStore?.hideZeroBalance}
                  onClick={() => {
                    handleHideZeroBalanceClick();
                  }}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("currency");
              }}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className="fs-h4 white center-align">{t("set-30_currency-in-wallet")}</Box>
                  <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"right"} gap={"5px"}>
                    <Box className="fs-16-regular gray center-align">{currentCurrencyStore?.currency}</Box>
                    <Box className="center-align">
                      <img src={arrowImg} />
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"left"}>
                  <Box
                    className="fs-14-regular gray"
                    sx={{
                      whiteSpace: "normal",
                    }}
                  >
                    {t("set-33_choose-currency-balance")}
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("chain-wallet");
              }}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className="fs-h4 white center-align">{t("set-97_network")}</Box>
                  <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"right"} gap={"5px"}>
                    <Box className="fs-16-regular gray center-align">{currentChainStore?.chain}</Box>
                    <Box className="center-align">
                      <img src={arrowImg} />
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"left"}>
                  <Box
                    className="fs-14-regular gray"
                    sx={{
                      whiteSpace: "normal",
                    }}
                  >
                    {t("set-98_network-detail")}
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            {/* <Button className="common-btn" sx={{ padding: "20px" }} onClick={() => setView("fee")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-31_fees")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} /> */}
            <Button className="common-btn" sx={{ padding: "20px" }} onClick={() => setView("address")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-32_address-book")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Wallet;
