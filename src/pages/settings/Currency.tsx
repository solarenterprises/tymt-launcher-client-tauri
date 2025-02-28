import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import { CONST_SUPPORT_CURRENCIES } from "../../const/CurrencyConsts";

import { AppDispatch } from "../../store";
import { getCurrentCurrency, setCurrentCurrency } from "../../store/CurrentCurrencySlice";

import { ICurrentCurrency } from "../../types/CurrencyTypes";

import backIcon from "../../assets/setting/BackIcon.svg";
import checkImg from "../../assets/setting/CheckIcon.svg";

export interface IPropsCurrency {
  view: string;
  setView: (_: string) => void;
}

const Currency = ({ view, setView }: IPropsCurrency) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);

  const handleCurrencyClick = (_currency: string) => {
    dispatch(setCurrentCurrency(_currency));
    setView("wallet");
  };

  return (
    <>
      {view === "currency" && (
        <Stack direction={"column"} width={"100%"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} padding={"20px"}>
            <Button className={"setting-back-button"} onClick={() => setView("wallet")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-34_currency")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} width={"100%"}>
            {CONST_SUPPORT_CURRENCIES?.map((supportCurrency) => (
              <div style={{ width: "100%" }} key={`currency-list-${supportCurrency?.name}`}>
                <Button
                  className="common-btn"
                  sx={{ padding: "20px", width: "100%" }}
                  onClick={() => {
                    handleCurrencyClick(supportCurrency?.name);
                  }}
                >
                  <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                    <Stack direction={"row"} justifyContent={"center"} textAlign={"right"} alignItems={"center"} gap={"5px"}>
                      <Box
                        className="center-align"
                        component={"img"}
                        src={supportCurrency?.icon}
                        width={"24px"}
                        height={"24px"}
                        sx={{
                          borderRadius: "12px",
                        }}
                      />
                      <Box className="fs-h5 white">{supportCurrency?.name}</Box>
                    </Stack>
                    <Box className="center-align">{currentCurrencyStore?.currency == supportCurrency?.name && <img src={checkImg} />}</Box>
                  </Stack>
                </Button>
                <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
              </div>
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Currency;
