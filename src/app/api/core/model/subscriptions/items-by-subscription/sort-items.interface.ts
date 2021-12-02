export interface ISort {
  value: SORT_KEYS;
  label: string;
}

export enum SORT_KEYS {
  DATE_DESC,
  DATE_ASC,
  PRICE_DESC,
  PRICE_ASC,
}
