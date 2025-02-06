import axios from "axios";

import { CONST_SUPPORT_CURRENCIES } from "../../const/CurrencyConsts";
import { CONFIG_TYMT_BACKEND_URL } from "../../config/MainConfig";

import { IReserve } from "../../types/CurrencyTypes";
import { ICurrencyAPIFetchReserveListResponse } from "../../types/APITypes/CurrencyAPITypes";

export class CurrencyAPI {
  static async fetchReserveList() {
    try {
      const res = await axios.get(`${CONFIG_TYMT_BACKEND_URL}/currencies`);

      const data: IReserve[] = CONST_SUPPORT_CURRENCIES?.map((one) => {
        const item: IReserve = {
          currency: one?.name,
          reserve: res?.data?.result?.data?.find((element: ICurrencyAPIFetchReserveListResponse) => element?.currency_id === one?.name)?.rate,
        };
        return item;
      });

      return data;
    } catch (err) {
      console.error("Failed to fetchReserveList: ", err);
    }
  }
}
