import { ISupportCurrency } from "../types/CurrencyTypes";
import USDIcon from "../assets/currency/USD.svg";
import EURIcon from "../assets/currency/EUR.svg";
import JPYIcon from "../assets/currency/JPY.png";
import GBPIcon from "../assets/currency/GBP.png";
import CNYIcon from "../assets/currency/CNY.png";
import AMDIcon from "../assets/currency/AMD.png";
import RUBIcon from "../assets/currency/RUB.png";
import PLNIcon from "../assets/currency/PLN.png";

export const CONST_CURRENCY_NAMES: { [key: string]: string } = {
  USD: "USD",
  EUR: "EUR",
  JPY: "JPY",
  GBP: "GBP",
  CNY: "CNY",
  AMD: "AMD",
  RUB: "RUB",
  PLN: "PLN",
};

// export const CONST_CURRENCY_RESERVES: { [key: string]: number } = {
//   USD: 1.0,
//   EUR: 1.0,
//   JPY: 1.0,
//   GBP: 1.0,
//   CNY: 1.0,
//   AMD: 1.0,
//   RUB: 1.0,
//   PLN: 1.0,
// };

export const CONST_CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  CNY: "元",
  AMD: "֏",
  RUB: "₽",
  PLN: "zł",
};

export const CONST_CURRENCY_ICONS: { [key: string]: string } = {
  USD: USDIcon,
  EUR: EURIcon,
  JPY: JPYIcon,
  GBP: GBPIcon,
  CNY: CNYIcon,
  AMD: AMDIcon,
  RUB: RUBIcon,
  PLN: PLNIcon,
};

export const CONST_SUPPORT_CURRENCIES: ISupportCurrency[] = [
  {
    name: CONST_CURRENCY_NAMES.USD,
    icon: CONST_CURRENCY_ICONS.USD,
    symbol: CONST_CURRENCY_SYMBOLS.USD,
  },
  {
    name: CONST_CURRENCY_NAMES.EUR,
    icon: CONST_CURRENCY_ICONS.EUR,
    symbol: CONST_CURRENCY_SYMBOLS.EUR,
  },
  {
    name: CONST_CURRENCY_NAMES.JPY,
    icon: CONST_CURRENCY_ICONS.JPY,
    symbol: CONST_CURRENCY_SYMBOLS.JPY,
  },
  {
    name: CONST_CURRENCY_NAMES.GBP,
    icon: CONST_CURRENCY_ICONS.GBP,
    symbol: CONST_CURRENCY_SYMBOLS.GBP,
  },
  {
    name: CONST_CURRENCY_NAMES.CNY,
    icon: CONST_CURRENCY_ICONS.CNY,
    symbol: CONST_CURRENCY_SYMBOLS.CNY,
  },
  {
    name: CONST_CURRENCY_NAMES.AMD,
    icon: CONST_CURRENCY_ICONS.AMD,
    symbol: CONST_CURRENCY_SYMBOLS.AMD,
  },
  {
    name: CONST_CURRENCY_NAMES.RUB,
    icon: CONST_CURRENCY_ICONS.RUB,
    symbol: CONST_CURRENCY_SYMBOLS.RUB,
  },
  {
    name: CONST_CURRENCY_NAMES.PLN,
    icon: CONST_CURRENCY_ICONS.PLN,
    symbol: CONST_CURRENCY_SYMBOLS.PLN,
  },
];
