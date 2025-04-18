import { FC } from "react";
import { useTranslation } from "react-i18next";
// import numeral from "numeral";

// import { currencySymbols } from "../../consts/SupportCurrency";

import { Box, Button, Divider, Stack, InputAdornment, TextField } from "@mui/material";

import FeeSwitchButton from "../../components/home/FeeSwitchButton";

// import { getWalletSetting, setWalletSetting } from "../../features/settings/WalletSettingSlice";
// import { getCurrencyList } from "../../features/wallet/CurrencyListSlice";
// import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";

import backIcon from "../../assets/setting/BackIcon.svg";

// import { IWalletSetting } from "../../types/settingTypes";
// import { ICurrencyList, ICurrentCurrency } from "../../types/wWalletTypes";

interface IPropsFee {
  view: string;
  setView: (panel: string) => void;
}

const Fee: FC<IPropsFee> = ({ view, setView }) => {
  const { t } = useTranslation();

  // const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  // const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  // const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);

  // const reserve: number = useMemo(
  //   () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
  //   [currencyListStore, currentCurrencyStore]
  // );
  // const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);

  return (
    <>
      {view === "fee" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("wallet")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-55_transaction-fee")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={"space-between"}>
            <Stack direction={"column"}>
              <Box className="center-align" padding={"30px 10px 10px 10px"}>
                <FeeSwitchButton />
              </Box>
              <Box className="center-align" padding={"10px"}>
                <TextField
                  id="outlined-adornment-weight"
                  placeholder="0.0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          "& .MuiBox-root": {
                            color: "white",
                          },
                          "& .MuiTypography-root": {
                            color: "white",
                          },
                        }}
                      >
                        {/* {symbol} */}
                      </InputAdornment>
                    ),
                    // classes: {
                    //   input: {
                    //     width: "100%",
                    //     textAlign: "right",

                    //     height: "58px",
                    //     borderRadius: "16px",
                    //     border: "1px solid #FFFFFF1A",
                    //     background: "#8080801A",
                    //     backgroundBlendMode: "luminosity",
                    //     color: "white",
                    //     boxShadow: "none",
                    //     "& .MuiInputBase-input": {
                    //       font: "unset",
                    //       color: "white",
                    //       fontFamily: "Cobe",
                    //       fontSize: "18px",
                    //       fontStyle: "normal",
                    //       fontWeight: "400",
                    //       lineHeight: "24px",
                    //       letterSpacing: "-0.36px",
                    //       padding: "0px 3px 5px  5px",
                    //       border: "none",
                    //       background: "none",
                    //     },
                    //     "& .MuiInputBase-root": {
                    //       font: "unset",
                    //       height: "58px",
                    //       borderRadius: "16px",
                    //       border: "1px solid #FFFFFF1A",
                    //       background: "#8080801A",
                    //       backgroundBlendMode: "luminosity",
                    //       fontFamily: "Cobe",
                    //       color: "var(--Basic-Light, #AFAFAF)",
                    //     },
                    //     "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    //       borderColor: "#FFFFFF33",
                    //       borderWidth: "3px",
                    //     },
                    //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    //       borderColor: "#FFFFFF33",
                    //       borderWidth: "3px",
                    //     },
                    //   },
                    // },
                  }}
                  // value={numeral(
                  //   Number(walletSettingStore?.fee) * Number(reserve)
                  // ).format("0,0.0000")}
                  onChange={() => {
                    // dispatch(
                    //   setWalletSetting({
                    //     ...walletSettingStore,
                    //     status: "input",
                    //     fee: Number(e.target.value) / Number(reserve),
                    //   })
                    // );
                  }}
                  sx={{
                    width: "100%",
                    textAlign: "right",

                    height: "58px",
                    borderRadius: "16px",
                    border: "1px solid #FFFFFF1A",
                    background: "#8080801A",
                    backgroundBlendMode: "luminosity",
                    color: "white",
                    boxShadow: "none",
                    "& .MuiInputBase-input": {
                      font: "unset",
                      color: "white",
                      fontFamily: "Cobe",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: "400",
                      lineHeight: "24px",
                      letterSpacing: "-0.36px",
                      padding: "0px 3px 5px  5px",
                      border: "none",
                      background: "none",
                    },
                    "& .MuiInputBase-root": {
                      font: "unset",
                      height: "58px",
                      borderRadius: "16px",
                      border: "1px solid #FFFFFF1A",
                      background: "#8080801A",
                      backgroundBlendMode: "luminosity",
                      fontFamily: "Cobe",
                      color: "var(--Basic-Light, #AFAFAF)",
                    },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FFFFFF33",
                      borderWidth: "3px",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FFFFFF33",
                      borderWidth: "3px",
                    },
                  }}
                />
              </Box>
              <Box
                className="fs-14-light white p-10"
                sx={{
                  whiteSpace: "normal",
                }}
              >
                {t("set-56_transaction-detail")}
              </Box>
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Fee;
