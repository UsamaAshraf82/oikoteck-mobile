import { goldprice, platprice, promoteplusprice } from './plan_price';

export const DISCOUNT = 15;
export const TAX = 24;

export const FREE_PRICE = 0;
export const PROMOTE_PRICE = 10;
export const PROMOTE_PLUS_PRICE = promoteplusprice[promoteplusprice.length - 1];
export const GOLD_PRICE = goldprice[goldprice.length - 1];
export const PLATINUM_PRICE = platprice[platprice.length - 1];
