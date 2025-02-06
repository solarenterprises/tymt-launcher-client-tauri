import numeral from "numeral";

export const formatBalance = (number: number, count = 2) => {
  const cryptoAmount = number?.toLocaleString("en", {
    minimumFractionDigits: count,
    maximumFractionDigits: count,
  });
  return numeral(cryptoAmount)?.format("0,0.0[0000]");
};
