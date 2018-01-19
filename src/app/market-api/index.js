import * as binanceApi from './binance-api';

export const MARKET = {
  BINANCE: 'binance'
}

export function load(marketName) {
  switch (marketName) {
    case MARKET.BINANCE:
    return binanceApi;
  default:
    throw `${marketName} is not supported`;
  }
}
