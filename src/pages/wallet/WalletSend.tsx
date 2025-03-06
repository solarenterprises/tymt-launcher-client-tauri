import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Grid, Box, Stack, IconButton, Button, CircularProgress } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { CONST_CHAIN_NAMES } from "../../const/ChainConsts";

import { useWallet } from "../../providers/WalletProvider";

import AnimatedComponent from "../../components/home/AnimatedComponent";
import InputText from "../../components/account/InputText";
import InputBox from "../../components/wallet/InputBox";
import AddressBookDrawer from "../../components/wallet/AddressBookDrawer";
import TransactionFeeDrawer from "../../components/wallet/TransactionFeeDrawer";
import ChooseChainDrawer from "../../components/wallet/ChooseChainDrawer";

import { AppDispatch } from "../../store";
import { getAccount } from "../../store/AccountSlice";
import { getCurrentChain } from "../../store/CurrentChainSlice";

import tymtCore from "../../lib/core/tymtCore";
import { getKeccak256Hash } from "../../lib/helper/EncryptHelper";
import { formatBalance } from "../../lib/helper/NumberHelper";

import walletIcon from "../../assets/wallet/Wallet.svg";

import { ICurrentChain } from "../../types/ChainTypes";
import { IRecipient } from "../../types/TransactionTypes";
import { useNotification } from "../../providers/NotificationProvider";
import { CONST_NOTIFICATION_CONTENTS } from "../../const/NotificationConsts";

const WalletSend = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const accountStore = useSelector(getAccount);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);

  const [addressBookView, setAddressBookView] = useState<boolean>(false);
  const [transactionFeeView, setTransactionFeeView] = useState<boolean>(false);
  const [chooseChainView, setChooseChainView] = useState<boolean>(false);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [draft, setDraft] = useState<IRecipient[]>([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    sxpFee,
    currentCurrencyReserve,
    currentCurrencySymbol,
    currentSupportChain,
    currentChainWalletAddress,
    currentChainNativeBalance,
    currentChainNativePrice,
    currentNativeOrToken,
    transferCoin,
    // fetchBalanceList,
  } = useWallet();
  const { showNotification } = useNotification();

  const updateDraft = useCallback(() => {
    if (address === "" || amount === "") return;
    if (draft.some((one) => one.address === address)) {
      showNotification({ content: CONST_NOTIFICATION_CONTENTS.ADDRESS_DUPLICATE });
      return;
    }

    const currentToken = {
      address: currentNativeOrToken?.address,
      symbol: currentNativeOrToken?.symbol,
      logo: currentNativeOrToken?.logo,
      decimals: currentNativeOrToken?.decimals,
    };

    const newItem: IRecipient = {
      address: address,
      amount: amount,
      chainSymbol: currentSupportChain?.native?.symbol,
      tokenSymbol: currentToken.symbol,
      tokenAddr: currentToken.address,
      tokenDecimals: currentToken.decimals,
      icon: currentToken.logo,
    };

    let recipientAddrIsValid = false;
    if (currentSupportChain?.native?.name === CONST_CHAIN_NAMES.SOLAR) {
      recipientAddrIsValid = tymtCore.Blockchains.solar.wallet.validateAddress(newItem.address);
    } else if (currentSupportChain?.native?.name === CONST_CHAIN_NAMES.BITCOIN) {
      recipientAddrIsValid = tymtCore.Blockchains.btc.wallet.validateAddress(newItem.address);
    } else if (currentSupportChain?.native?.name === CONST_CHAIN_NAMES.SOLANA) {
      recipientAddrIsValid = tymtCore.Blockchains.solana.wallet.validateAddress(newItem.address);
    } else {
      recipientAddrIsValid = tymtCore.Blockchains.eth.wallet.validateAddress(newItem.address);
    }
    if (!recipientAddrIsValid) {
      return;
    }

    setDraft([...draft, newItem]);
  }, [draft, setDraft, address, amount, currentSupportChain, currentNativeOrToken]);

  const handleTransfer = useCallback(async () => {
    try {
      setLoading(true);
      let recipients: IRecipient[] = [];
      if (draft?.length > 0) {
        recipients = draft;
      } else {
        recipients = [
          {
            address: address,
            amount: amount,
            chainSymbol: currentSupportChain?.native?.symbol,
            tokenSymbol: currentNativeOrToken?.symbol,
            tokenAddr: currentNativeOrToken?.address,
            tokenDecimals: currentNativeOrToken?.decimals,
            icon: currentNativeOrToken?.logo,
          },
        ];
      }

      const res = await transferCoin(recipients, sxpFee.toString());
      if (res.success) {
        showNotification({ content: CONST_NOTIFICATION_CONTENTS.TX_SENT_SUCCESS });
        setDraft([]);
      } else {
        showNotification({ content: CONST_NOTIFICATION_CONTENTS.TX_SENT_FAIL, text: res.error });
        if (res?.data?.failedTransactions) {
          const newDraft = draft.filter((one) => res?.data?.failedTransactions?.some((two) => two === one.address));
          setDraft(newDraft);
        }
      }

      console.log("handleTransfer", res);
      return res;
    } catch (err) {
      console.error(`Failed to handleTransfer`, err);
    } finally {
      setLoading(false);
    }
  }, [sxpFee, draft, address, amount, password, currentNativeOrToken, currentSupportChain, dispatch]);

  const removeDraft = useCallback(
    (deleteId: number) => {
      setDraft((prevDraft) => {
        return prevDraft.filter((_, index) => index !== deleteId);
      });
    },
    [draft, setDraft]
  );

  const handleAmount = useCallback(
    (value: string) => {
      setAmount(value);
    },
    [amount, setAmount]
  );

  useEffect(() => {
    setDraft([]);
    setAmount("");
    setAddress("");
    setPassword("");
  }, [currentChainStore]);

  return (
    <AnimatedComponent threshold={0}>
      <Grid container>
        <Grid container>
          <Grid item xs={12} md={12} xl={7} mb={"80px"}>
            <Box className={"wallet-form-card p-32-56 br-16"}>
              <Box className={"fs-h2 white"} mb={"32px"}>
                {t("wal-7_send-sxp")}
              </Box>
              <Box className={"wallet-form-card-hover p-24-16 br-16"} mb={"32px"} onClick={() => setChooseChainView(true)}>
                <Stack direction="row" alignItems={"center"} spacing={"16px"}>
                  <Box component={"img"} src={currentSupportChain?.native?.logo} width={"36px"} height={"36px"} />
                  <Stack>
                    <Stack direction={"row"} spacing={"10px"}>
                      <Box className={"fs-18-regular light"}>{t("wal-8_from")}</Box>
                      <Box className={"fs-18-regular white"}>{currentSupportChain?.native?.name}</Box>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                      <Box component={"img"} src={walletIcon} width={"12px"} height={"12px"} />
                      <Box className={"fs-14-regular light"}>{currentChainWalletAddress}</Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
              <Box className={"wallet-form-card p-16-16 br-16 blur"} mb={"32px"}>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mb={"16px"}>
                  <Box className={"fs-18-regular light"}>{t("wal-9_you-send")}</Box>
                  <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                    <Box component={"img"} src={walletIcon} width={"18px"} height={"18px"} />
                    <Box className={"fs-12-light light"}>{formatBalance(currentChainNativeBalance ?? 0, 4)}</Box>
                    <Box
                      className={"fs-14-bold blue"}
                      onClick={() => {
                        setAmount(currentChainNativeBalance?.toString());
                        handleAmount(currentChainNativeBalance?.toString());
                      }}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      {t("wal-10_max")}
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Stack width={"100%"}>
                    <InputBox id="send-amount" placeholder="0.0" label="" align="left" onChange={handleAmount} value={amount?.toString()} />
                    <Box className={"fs-12-light light"}>{`~${currentCurrencySymbol} ${formatBalance(
                      Number(amount) * Number(currentChainNativePrice) * currentCurrencyReserve,
                      4
                    )}`}</Box>
                  </Stack>
                  <Stack direction={"row"} alignItems={"center"} padding={"4px 8px"} spacing={"8px"}>
                    <Box component={"img"} src={currentSupportChain?.native?.logo} width={30} />
                    <Box className={"fs-18-regular white"}>{currentSupportChain?.native?.symbol}</Box>
                    {/* <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <Stack direction={"row"} gap={1}>
                        <Box>
                          <img src={""} width={30} />
                        </Box>
                        <Box className="fs-18-regular white">{"asdf"}</Box>
                      </Stack>
                    </Button> */}
                    {/* <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        {options.map((token, index) => (
                          <MenuItem onClick={() => {}} key={`${token}-${index}`}>
                            <Stack direction={"row"} gap={1}>
                              <Box>
                                <img src={token.icon} width={20} />
                              </Box>
                              <Box>{token.label}</Box>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Menu> */}
                  </Stack>
                </Stack>
              </Box>
              <Box className={"wallet-form-card p-16-16 br-16 blur"} mb={"32px"}>
                <Box className={"fs-18-regular light"} mb={"8px"}>
                  {t("wal-11_to")}
                </Box>
                <InputText
                  id="recipient-address"
                  type="address"
                  value={address}
                  setValue={setAddress}
                  label={t("wal-12_recipient-address")}
                  onIconButtonClick={() => {
                    navigator.clipboard.writeText(address);
                  }}
                  onAddressButtonClick={() => setAddressBookView(true)}
                />
                {Number(amount) > 0 && address !== "" && (Number(sxpFee) > 0 || currentSupportChain?.native?.symbol !== "SXP") && (
                  <Button
                    fullWidth
                    sx={{
                      "&.MuiButtonBase-root": {
                        textTransform: "none",
                        fontSize: "18px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "24px" /* 133.333% */,
                        letterSpacing: "-0.36px",
                        height: "46px",
                        borderRadius: "16px",
                        backgroundColor: "transparent",
                        color: "#52E1F2",
                        borderColor: "#EF4444",
                        fontFamily: "Cobe",
                        boxShadow: "none",
                        border: "1px solid",
                        paddingTop: "5px",
                        "&:hover": {
                          borderColor: "#EF4444",
                          backgroundColor: "#EF4444",
                        },
                        "&:active": {
                          backgroundColor: "#EF4444",
                          boxShadow: "1px 1px #EF44445F",
                        },
                        "&:disabled": {
                          backgroundColor: "#222222", // Example: light gray background
                          color: "#A0A0A0", // Example: gray text color
                          borderColor: "#222222", // Example: gray border color
                        },
                      },
                    }}
                    onClick={() => {
                      updateDraft();
                    }}
                  >
                    {t("set-57_save")}
                  </Button>
                )}
              </Box>
              {(currentSupportChain?.native?.symbol === "SXP" || currentSupportChain?.native?.symbol === "BTC") && (
                <Box className={"wallet-form-card p-16-16 br-16"} mb={"32px"}>
                  <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Box className={"fs-16-regular light"}>{t("wal-13_trans-fee")}</Box>
                    <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                      <Box className={"fs-16-regular white"}>{`${sxpFee} ${currentSupportChain?.native?.symbol}`}</Box>
                      <IconButton className="icon-button" onClick={() => setTransactionFeeView(true)}>
                        <EditOutlinedIcon className="icon-button" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              )}
              <Box mb={"32px"}>
                <InputText id="send-password" type="password" label={t("ncca-3_password")} value={password} setValue={setPassword} showTooltip={false} />
              </Box>
              <Button
                disabled={
                  loading ||
                  Number(amount) === 0 ||
                  address === "" ||
                  (Number(sxpFee) === 0 && currentSupportChain?.native?.symbol === "SXP") ||
                  getKeccak256Hash(password) !== accountStore?.password
                }
                className={"red-button fw"}
                onClick={handleTransfer}
              >
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: "#F5EBFF",
                    }}
                  />
                ) : (
                  t("wal-14_transfer")
                )}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} xl={5} padding={"0px 32px"}>
            <Stack spacing={"16px"}>
              {draft.map((data, index) => (
                <Box className={"wallet-form-card p-16-16 br-16"} key={`${data?.amount}-${index}`}>
                  <Stack spacing={"15px"}>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                      <Stack>
                        <Box className="fs-18-regular light">{t("wal-11_to")}</Box>
                        <Box className="fs-18-regular white">{data.address}</Box>
                      </Stack>
                      <IconButton
                        className="icon-button"
                        onClick={() => {
                          removeDraft(index);
                        }}
                      >
                        <DeleteOutlineIcon className="icon-button" />
                      </IconButton>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                      <Box className="fs-16-regular light">{t("wal-15_amount")}</Box>
                      <Box className="fs-16-regular white">{data.amount + " " + data.tokenSymbol}</Box>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <AddressBookDrawer view={addressBookView} setView={setAddressBookView} setAddress={setAddress} />
      <TransactionFeeDrawer view={transactionFeeView} setView={setTransactionFeeView} />
      <ChooseChainDrawer view={chooseChainView} setView={setChooseChainView} />
    </AnimatedComponent>
  );
};

export default WalletSend;
