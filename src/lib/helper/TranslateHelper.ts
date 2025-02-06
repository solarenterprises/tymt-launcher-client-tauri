import translate from "translate";

import tymtStorage from "../storage/tymtStorage";

import { ILanguage } from "../../types/SettingTypes";

export const i18nGoogle: { [key: string]: string } = {
  en: "en",
  jp: "ja",
};

export const translateString = async (origin: string) => {
  try {
    const languageStore: ILanguage = JSON.parse(await tymtStorage.get(`language`));
    const i18nLang = languageStore.language;
    let translatedMessage: string = "";
    const refinedOrigin = origin.replace(/[&#]/g, " ");
    if (i18nLang !== "en") {
      // const googleLang = i18nGoogle[i18nLang];
      translatedMessage = await translate(refinedOrigin, {
        from: "en",
      });
    } else {
      translatedMessage = origin;
    }
    return translatedMessage;
  } catch (err) {
    console.error("Failed to translateString at TranslateAPI: ", err);
    return "";
  }
};
