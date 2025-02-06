import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import { CONST_CURRENCY_NAMES } from "../../const/CurrencyConsts";

import { AppDispatch } from "../../store";
import { getLanguageSetting, setLanguageSetting } from "../../store/LanguageSettingSlice";
import { setCurrentCurrency } from "../../store/CurrentCurrencySlice";

import { ILanguageSetting } from "../../types/SettingTypes";

import backIcon from "../../assets/setting/BackIcon.svg";
import checkImg from "../../assets/setting/CheckIcon.svg";

export interface IPropsLanguage {
  view: string;
  setView: (_: string) => void;
}

const Language = ({ view, setView }: IPropsLanguage) => {
  const dispatch = useDispatch<AppDispatch>();
  const languageSettingStore: ILanguageSetting = useSelector(getLanguageSetting);

  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation();

  const setLang = (lang: string) => {
    dispatch(setLanguageSetting(lang));
  };

  useEffect(() => {
    changeLanguage(languageSettingStore.lang);
  }, [languageSettingStore]);

  return (
    <>
      {view === "language" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-16_application-language")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setLang("en");
                dispatch(setCurrentCurrency(CONST_CURRENCY_NAMES["USD"]));
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-9_english")}</Box>
                <Box className="center-align">{languageSettingStore.lang == "en" && <img src={checkImg} />}</Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setLang("jp");
                dispatch(setCurrentCurrency(CONST_CURRENCY_NAMES["JPY"]));
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-17_japanese")}</Box>
                <Box className="center-align">{languageSettingStore.lang == "jp" && <img src={checkImg} />}</Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Language;
