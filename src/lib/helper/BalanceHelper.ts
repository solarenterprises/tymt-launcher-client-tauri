import { CONST_SUPPORT_CHAINS } from "../../const/ChainConsts";

import { IBalance } from "../../types/WalletTypes";

export const resetBalanceList = () => {
  try {
    const nativeTokens: IBalance[] = CONST_SUPPORT_CHAINS?.map((one) => {
      const item: IBalance = {
        symbol: one?.native?.symbol,
        balance: 0.0,
      };
      return item;
    });

    const altTokens: IBalance[] = CONST_SUPPORT_CHAINS?.flatMap((chain) =>
      chain?.tokens?.map((token) => {
        const item: IBalance = {
          symbol: token?.symbol,
          balance: 0.0,
        };
        return item;
      })
    );

    const res: IBalance[] = [...nativeTokens, ...altTokens];
    return res;
  } catch (err) {
    console.error("Failed to resetBalanceList: ", err);
  }
};
