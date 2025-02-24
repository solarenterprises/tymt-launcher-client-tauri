import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";

import { Box, Button, Divider, Stack } from "@mui/material";

import { useWallet } from "../../providers/WalletProvider";

import Avatar from "../../components/home/Avatar";

import { getAccount } from "../../store/AccountSlice";
import { getAccountList } from "../../store/AccountListSlice";

import { IAccount, IAccountList } from "../../types/AccountTypes";

import { openLink } from "../../lib/helper/TauriHelper";

import settingImg from "../../assets/setting/SettingIcon1.svg";
import walletImg from "../../assets/setting/WalletIcon.svg";
import arrowImg from "../../assets/setting/ArrowRight.svg";
import copyIcon from "../../assets/setting/CopyIcon.svg";
import searchIcon from "../../assets/setting/SearchIcon.svg";
import exitIcon from "../../assets/setting/ExitIcon.svg";
import { setAuth } from "../../store/AuthSlice";
import TooltipComponent from "../../components/home/TooltipComponent";

export interface IPropsMain {
  view: string;
  setView: (_: string) => void;
}

const Main = ({ view, setView }: IPropsMain) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    currentSupportChain,
    currentChainWalletAddress,
    currentChainExplorerUrl,
    currentChainNativeBalance,
    currentChainNativePrice,
    currentCurrencySymbol,
    totalBalance,
  } = useWallet();

  const accountStore: IAccount = useSelector(getAccount);
  const accountListStore: IAccountList = useSelector(getAccountList);

  const handleExplorer = useCallback(() => {
    openLink(currentChainExplorerUrl);
  }, [currentChainExplorerUrl]);

  const handleLogout = useCallback(() => {
    dispatch(
      setAuth({
        isLoggedIn: false,
        accessToken: "",
        refreshToken: "",
      })
    );
    accountListStore?.list?.length ? navigate("/non-custodial-login-1") : navigate("/welcome");
  }, [accountListStore]);

  return (
    <>
      {view === "main" && (
        <Box sx={{ display: "flex", borderRadius: "24px", margin: "16px", flexDirection: "column", border: "solid 1px #FFFFFF1A" }}>
          <Box
            onClick={() => setView("chooseProfile")}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
              alignItems: "center",
              padding: "32px 16px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              borderRadius: "22px 22px 0px 0px",
              "&:hover": {
                backgroundColor: "#ffffff1a",
              },
            }}
          >
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Box className="center-align">
                <Avatar onlineStatus={true} url={accountStore?.avatar} size={60} status={"active"} />
              </Box>
              <Box className="center-align" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                <Box className="fs-14-light white">{t("set-1_welcome")}</Box>
                <Box className="fs-h4 white">{accountStore?.nickname}</Box>
              </Box>
              <Box component={"img"} src={arrowImg} />
            </Box>
            <Box>
              <Button
                className="button_navbar_common"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setView("general");
                }}
                sx={{ padding: 0 }}
              >
                <img src={settingImg} />
              </Button>
            </Box>
          </Box>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Button
            onClick={() => setView("chain")}
            className="center-align common-btn"
            sx={{
              padding: "16px 16px",
            }}
          >
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} alignItems={"center"}>
              <Box className="center-align" sx={{ gap: "10px" }}>
                <Box className="center-align" sx={{ position: "relative" }}>
                  <img src={walletImg} />
                  <img
                    src={currentSupportChain?.native?.logo}
                    style={{
                      position: "absolute",
                      right: "0px",
                      bottom: "0px",
                      width: "20px",
                    }}
                  />
                </Box>
                <Box
                  className="center-align"
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginLeft: "10px",
                  }}
                >
                  <Box className="fs-14-light gray">{t("set-3_connected-chain")}:</Box>
                  <Box className="fs-14-light white">{currentSupportChain?.native?.name}</Box>
                </Box>
              </Box>
              <Box className="center-align">
                <img src={arrowImg} />
              </Box>
            </Stack>
          </Button>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Box sx={{ backgroundColor: "#0f2727", margin: "15px", borderRadius: "16px", display: "flex", flexDirection: "column" }}>
            <Box sx={{ justifyContent: "space-between", margin: "15px", paddingBottom: "15px", display: "flex" }}>
              <Box
                sx={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <Box className="fs-14-light gray">{t("set-2_connected-wallet-address")}:</Box>
                <Box className="fs-14-light blue">{currentChainWalletAddress ?? ""}</Box>
                <Box className="fs-14-light gray">
                  {`${t("set-4_balance")} ${numeral(currentChainNativeBalance ?? 0).format("0,0.0000")} ${currentSupportChain?.native?.symbol} (${numeral(
                    (currentChainNativeBalance ?? 0) * (currentChainNativePrice ?? 0)
                  ).format("0,0.00")} ${currentCurrencySymbol})`}
                </Box>
                <Box className="fs-14-light gray">{`${t("set-88_total_balance")} ${numeral(totalBalance).format("0,0.00")} ${currentCurrencySymbol}`}</Box>
              </Box>
            </Box>
            <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center", alignItem: "center", gap: "45px", margin: "20px" }}>
              <Button className="tooltip-btn" onClick={() => navigator.clipboard.writeText(currentChainWalletAddress ?? "")}>
                <TooltipComponent placement="bottom" text={t("set-79_copy-address")}>
                  <Box className="center-align">
                    <img src={copyIcon} data-tooltip-id="copy-tooltip" />
                  </Box>
                </TooltipComponent>
              </Button>
              <Button className="tooltip-btn" onClick={handleExplorer}>
                <TooltipComponent placement="bottom" text={t("set-80_open-in-explorer")}>
                  <Box className="center-align">
                    <img src={searchIcon} />
                  </Box>
                </TooltipComponent>
              </Button>
              <Button className="tooltip-btn" onClick={handleLogout}>
                <TooltipComponent placement="bottom" text={t("set-81_disconnect")}>
                  <Box className="center-align">
                    <img src={exitIcon} />
                  </Box>
                </TooltipComponent>
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Main;
