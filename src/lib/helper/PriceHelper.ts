import { CONST_SUPPORT_CHAINS } from "../../const/ChainConsts";

import { IPrice } from "../../types/PriceTypes";

export const resetPriceList = () => {
  try {
    const uniqueCmcSet = new Set();

    const nativeTokens: IPrice[] = CONST_SUPPORT_CHAINS?.map((one) => {
      const item: IPrice = {
        cmc: one?.native?.cmc,
        price: 14.0,
      };
      uniqueCmcSet.add(item.cmc); // Add to the set
      return item;
    });

    const altTokens: IPrice[] = CONST_SUPPORT_CHAINS?.flatMap((chain) =>
      chain?.tokens?.reduce((acc, token) => {
        if (!uniqueCmcSet.has(token.cmc)) {
          const item: IPrice = {
            cmc: token?.cmc,
            price: 14.0,
          };
          uniqueCmcSet.add(item.cmc);
          acc.push(item);
        }
        return acc;
      }, [])
    );

    const res = [...nativeTokens, ...altTokens];
    return res;
  } catch (err) {
    console.error("Failed to resetPriceList: ", err);
  }
};
