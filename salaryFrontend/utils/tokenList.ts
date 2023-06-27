/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-05 12:14:23
 * @Description:
 */
export const tokenList = [
  // {
  //   Token:"ETH",
  //   Number:0,
  //   Address: "0x0000000000000000000000000000000000000000",
  //   Symbol: 18,

  // },
  {
    Token: "USDT",
    Number: 0,
    // Address:"0x81A9205F956A1D6ae81f51977Da9702A023e199a",
    Address: "0x921e59112D6fFeD8b7B5109D80418e53Faf02eb9",
    Symbol: 6,
  },
];

export const tokenDic: { [key: string]: string } = {
  // "ETH":"0x0000000000000000000000000000000000000000",
  // "USDT":"0x81A9205F956A1D6ae81f51977Da9702A023e199a"
  USDT: "0x921e59112D6fFeD8b7B5109D80418e53Faf02eb9",
};

export const tokenSymbol: { [key: string]: number } = {
  // "ETH":18,
  USDT: 6,
};
