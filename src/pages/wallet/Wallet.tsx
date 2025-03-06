import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

import { Grid, Stack, Box, IconButton, Button, Pagination } from "@mui/material";

import { CONST_CHAIN_NAMES, CONST_SUPPORT_CHAINS } from "../../const/ChainConsts";

import { useWallet } from "../../providers/WalletProvider";

import SwitchComp from "../../components/home/SwitchComp";
import WalletCard from "../../components/wallet/WalletCard";
import TransCard from "../../components/wallet/TransCard";
import ComingModal from "../../components/modal/ComingModal";
import AnimatedComponent from "../../components/home/AnimatedComponent";
import TooltipComponent from "../../components/home/TooltipComponent";

import { AppDispatch } from "../../store";
import { getBalanceList } from "../../store/BalanceListSlice";
import { getCurrentToken, setCurrentToken } from "../../store/CurrentTokenSlice";
import { getWalletSetting, setWalletSetting } from "../../store/WalletSettingSlice";
import { getWallet } from "../../store/WalletSlice";

import { CryptoAPI } from "../../lib/api/CryptoAPI";

import { getNativeTokenBalanceByChainName } from "../../lib/helper/WalletHelper";

import { IBalanceList, ICurrentToken, IWalletAddresses } from "../../types/WalletTypes";
import { ITransactionPagination } from "../../types/TransactionTypes";
import { IWalletSetting } from "../../types/SettingTypes";

import sendIcon from "../../assets/wallet/SendIcon.svg";
import receiveIcon from "../../assets/wallet/ReceiveIcon.svg";
import percentIcon from "../../assets/wallet/PercentIcon.svg";
import refreshIcon from "../../assets/wallet/RefreshIcon.svg";

// const order = ["Solar", "Binance", "Ethereum", "Bitcoin", "Solana", "Polygon", "Avalanche", "Arbitrum", "Optimism"];

const Wallet = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { currentSupportChain, currentCurrencySymbol, totalBalance, handleRefreshClick } = useWallet();

  const currentTokenStore: ICurrentToken = useSelector(getCurrentToken);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  const walletStore: IWalletAddresses = useSelector(getWallet);

  const [loading, setLoading] = useState<boolean>(false);
  const [comingSoon, setComingSoon] = useState<boolean>(false);
  const [txList, setTxList] = useState<ITransactionPagination>();
  const [currentTxPage, setCurrentTxPage] = useState<number>(1);

  const fetchTransactionList = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        let res;
        switch (currentSupportChain?.native?.name) {
          case CONST_CHAIN_NAMES.SOLAR:
            res = await CryptoAPI.getSxpTransactions(walletStore?.solar, page, 20);
            break;
          case CONST_CHAIN_NAMES.ETHEREUM:
            res = await CryptoAPI.getEthTransactions(walletStore?.ethereum, page, 20);
            break;
          case CONST_CHAIN_NAMES.BINANCE:
            res = await CryptoAPI.getBscTransactions(walletStore?.binance, page, 20);
            break;
          case CONST_CHAIN_NAMES.POLYGON:
            res = await CryptoAPI.getPolTransactions(walletStore?.polygon, page, 20);
            break;
          case CONST_CHAIN_NAMES.ARBITRUM:
            res = await CryptoAPI.getArbTransactions(walletStore?.arbitrum, page, 20);
            break;
          case CONST_CHAIN_NAMES.AVALANCHE:
            res = await CryptoAPI.getAvaxTransactions(walletStore?.avalanche, page, 20);
            break;
          case CONST_CHAIN_NAMES.OPTIMISM:
            res = await CryptoAPI.getOpTransactions(walletStore?.optimism, page, 20);
            break;
        }
        setTxList(res);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [walletStore, currentSupportChain]
  );

  const handleWalletRefreshClick = () => {
    handleRefreshClick();
    if (currentTxPage === 1) fetchTransactionList(1);
    setCurrentTxPage(1);
  };

  const handlePageChange = async (_event: any, value: number) => {
    setCurrentTxPage(value);
  };

  useEffect(() => {
    fetchTransactionList(currentTxPage);
  }, [currentTxPage, currentSupportChain]);

  useEffect(() => {
    handleRefreshClick();
  }, []);

  return (
    <>
      <AnimatedComponent threshold={0}>
        <div>
          <Grid container>
            <Grid item xs={12} className="p-lr-50 p-tb-20">
              <Box className="fs-h1 white">{t("set-13_wallet")}</Box>
            </Grid>
            <Grid container>
              <Grid item xl={7} sm={12}>
                <Stack className="m-l-50 p-r-50 p-tb-20" sx={{ borderBottom: "solid 1px #FFFFFF1A" }}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"column"} justifyContent={"space-around"} gap={2}>
                      <Stack direction={"row"} justifyContent={"space-between"} gap={2}>
                        <Box className="fs-18-regular gray">{t("set-4_balance")}</Box>

                        <Box>
                          {CONST_SUPPORT_CHAINS?.map((supportChain, index) => (
                            <TooltipComponent placement="top" text={supportChain?.native?.name} key={`chain-icon-${index}`}>
                              <img
                                src={supportChain?.native?.logo}
                                key={index}
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "-5px",
                                }}
                              />
                            </TooltipComponent>
                          ))}
                        </Box>
                      </Stack>
                      <Stack direction={"row"} justifyContent={"flex-start"} gap={2}>
                        <Box className="fs-h4 white">{currentCurrencySymbol}</Box>
                        <Box className="fs-h2 white">{numeral(totalBalance).format("0,0.00")}</Box>
                      </Stack>
                    </Stack>
                    <Stack direction={"row"} spacing={"32px"}>
                      <Stack spacing={"8px"}>
                        <IconButton className={"wallet-icon-button"} onClick={() => navigate("/wallet-send")}>
                          <img src={sendIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                        <Box className="fs-14-regular blue t-center fw">{t("wal-1_send")}</Box>
                      </Stack>
                      <Stack spacing={"8px"}>
                        <IconButton
                          className={"wallet-icon-button "}
                          onClick={() => {
                            setComingSoon(true);
                          }}
                        >
                          <img src={receiveIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                        <Box className="fs-14-regular blue t-center fw">{t("wal-2_buy")}</Box>
                      </Stack>
                      <Stack spacing={"8px"}>
                        <IconButton className={"wallet-icon-button"} onClick={() => navigate("/wallet-vote")}>
                          <img src={percentIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                        <Box className="fs-14-regular t-center fw blue">{t("wal-3_vote")}</Box>
                      </Stack>
                      <Stack spacing={"8px"}>
                        <IconButton className={"wallet-icon-button"} onClick={handleWalletRefreshClick}>
                          <img src={refreshIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                        <Box className="fs-14-regular center fw blue">{t("sto-35_refresh")}</Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack padding={"30px"} justifyContent={"center"}>
                  <Stack direction={"row"} justifyContent={"flex-end"} gap={3} padding={"20px"}>
                    <Box className={"fs-18-regular white"}>{t("wal-5_hide-0-balance")}</Box>
                    <Box>
                      <SwitchComp
                        checked={walletSettingStore?.hideZeroBalance}
                        onClick={() => {
                          dispatch(
                            setWalletSetting({
                              ...walletSettingStore,
                              hideZeroBalance: !walletSettingStore?.hideZeroBalance,
                            })
                          );
                        }}
                      />
                    </Box>
                  </Stack>
                  <Grid container spacing={"32px"}>
                    {CONST_SUPPORT_CHAINS?.map((supportChain, index) => {
                      if (walletSettingStore?.hideZeroBalance) {
                        if (getNativeTokenBalanceByChainName(balanceListStore, supportChain?.native?.name) > 0) {
                          return (
                            <Grid item xs={6} key={`wallet-card-non-zero-${index}`}>
                              <WalletCard supportChain={supportChain} index={index} setLoading={setLoading} />
                            </Grid>
                          );
                        }
                      } else {
                        return (
                          <Grid item xs={6} key={`wallet-card-${index}`}>
                            <WalletCard supportChain={supportChain} index={index} setLoading={setLoading} />
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xl={5} sm={12}>
                <Stack padding={"25px"}>
                  <Box className={"fs-20-regular white"}>{t("wal-4_last-trans")}</Box>
                  {currentSupportChain?.tokens?.length !== 0 && (
                    <Stack direction={"row"} gap={2} className="m-tb-10">
                      <Button
                        className={`common-btn ${currentTokenStore?.token === currentSupportChain?.native?.symbol ? "active" : ""}`}
                        onClick={() => {
                          dispatch(setCurrentToken(currentSupportChain?.native?.symbol));
                        }}
                      >
                        <Stack direction={"row"} justifyContent={"center"} textAlign={"center"} alignItems={"center"} gap={1}>
                          <Box className="center-align">
                            <img src={currentSupportChain?.native?.logo} width={20} />
                          </Box>
                          <Box className="fs-14-regular white">{currentSupportChain?.native?.symbol}</Box>
                        </Stack>
                      </Button>
                      {currentSupportChain?.tokens?.map((token, index) => (
                        <Button
                          className={`common-btn ${currentTokenStore?.token === token.symbol ? "active" : ""}`}
                          key={`current-chain-tokens-${index}`}
                          onClick={() => {
                            dispatch(setCurrentToken(token?.symbol));
                          }}
                        >
                          <Stack direction={"row"} justifyContent={"center"} textAlign={"center"} alignItems={"center"} gap={1}>
                            <Box className="center-align">
                              <img src={token.logo} width={20} />
                            </Box>
                            <Box className="fs-14-regular white">{token.displaySymbol}</Box>
                          </Stack>
                        </Button>
                      ))}
                    </Stack>
                  )}
                </Stack>
                <Box
                  sx={{
                    maxHeight: "800px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  <TransCard loading={loading} txList={txList} />
                </Box>
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
                      marginBottom: "30px",
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
              </Grid>
            </Grid>
          </Grid>
        </div>
      </AnimatedComponent>
      <ComingModal open={comingSoon} setOpen={setComingSoon} />
    </>
  );
};

export default Wallet;
