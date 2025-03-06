import { CONST_CHAIN_SYMBOLS } from "../../const/ChainConsts";

import { IPrice } from "../../types/PriceTypes";

// export const resetPriceList = () => {
//   try {
//     const uniqueCmcSet = new Set();

//     const nativeTokens: IPrice[] = CONST_SUPPORT_CHAINS?.map((one) => {
//       const item: IPrice = {
//         symbol: one?.native?.cmc,
//         price: 14.0,
//       };
//       uniqueCmcSet.add(item.symbol); // Add to the set
//       return item;
//     });

//     const altTokens: IPrice[] = CONST_SUPPORT_CHAINS?.flatMap((chain) =>
//       chain?.tokens?.reduce((acc, token) => {
//         if (!uniqueCmcSet.has(token.cmc)) {
//           const item: IPrice = {
//             symbol: token?.cmc,
//             price: 14.0,
//           };
//           uniqueCmcSet.add(item.symbol);
//           acc.push(item);
//         }
//         return acc;
//       }, [])
//     );

//     const res = [...nativeTokens, ...altTokens];
//     return res;
//   } catch (err) {
//     console.error("Failed to resetPriceList: ", err);
//   }
// };

export const resetPriceList = () => {
  try {
    const nativeTokens: IPrice[] = Object.values(CONST_CHAIN_SYMBOLS).map((symbol) => {
      return {
        symbol,
        price: 14.0,
      };
    });
    return nativeTokens;
  } catch (err) {
    console.error("Failed to resetPriceList: ", err);
  }
};
