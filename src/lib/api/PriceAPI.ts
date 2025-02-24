import axios, { AxiosResponse } from "axios";
import { isArray } from "lodash";

import tymtStorage from "../storage/tymtStorage";
import { CONFIG_TYMT_BACKEND_URL } from "../../config/MainConfig";

import { ISaltToken } from "../../types/AccountTypes";
import { IPrice } from "../../types/PriceTypes";
import { IPriceAPIGetAllTokenPricesResponse } from "../../types/APITypes/PriceAPITypes";

export class PriceAPI {
  static async getAllTokenPrices(): Promise<IPriceAPIGetAllTokenPricesResponse[]> {
    try {
      const result = await axios.get(`${CONFIG_TYMT_BACKEND_URL}/token-prices/latest-token-prices-cmc`);
      if (!result?.data?.result?.data && !isArray(result?.data?.result?.data)) {
        // console.error("getAllTokenPrices: response undefined or not an array");
        return [] as IPriceAPIGetAllTokenPricesResponse[];
      }
      return result?.data?.result?.data as IPriceAPIGetAllTokenPricesResponse[];
    } catch (err) {
      console.error("Failed to PriceAPI.getAllTokenPrices: ", err);
    }
  }

  static async getTokenPrices(): Promise<AxiosResponse<any, any>> {
    try {
      const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
      const result = await axios.get(`${CONFIG_TYMT_BACKEND_URL}/token-prices`, {
        headers: {
          "x-token": saltTokenStore.token,
        },
      });
      return result.data.result.data;
    } catch (err) {
      console.error("Failed to PriceAPI.getTokenPrices: ", err);
    }
  }

  static async getTokenPrice(cmc: string): Promise<AxiosResponse<any, any>> {
    try {
      const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
      const result = await axios.get(`${CONFIG_TYMT_BACKEND_URL}/token-prices/latest-token-price-by-cmc/${cmc}`, {
        headers: {
          "x-token": saltTokenStore.token,
        },
      });
      return result.data.result.data[0].price;
    } catch (err) {
      console.error("Failed to PriceAPI.getTokenPrice: ", err);
    }
  }

  static fetchPriceList = async () => {
    try {
      const data = await PriceAPI.getAllTokenPrices();
      if (!data) return;
      const res: IPrice[] = data.map((one) => {
        return {
          symbol: one?.symbol,
          price: one?.price,
        };
      });
      return res;
    } catch (err) {
      console.error("Failed to PriceAPI.fetchPriceList: ", err);
    }
  };
}
