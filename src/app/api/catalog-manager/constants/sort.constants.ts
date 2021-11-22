export enum SORT_KEYS {
  DATE_DESC = 'date_desc',
  DATE_ASC = 'date_asc',
  PRICE_DESC = 'price_desc',
  PRICE_ASC = 'price_asc',
}
export const SORTS: ISort[] = [
  {
    value: SORT_KEYS.DATE_DESC,
    label: $localize`:@@web_catalog_filter_date_desc:Date: from recent to old`,
  },
  {
    value: SORT_KEYS.DATE_ASC,
    label: $localize`:@@web_catalog_filter_date_asc:Date: from old to recent`,
  },
  {
    value: SORT_KEYS.PRICE_DESC,
    label: $localize`:@@web_catalog_filter_price_desc:Price: from high to low`,
  },
  {
    value: SORT_KEYS.PRICE_ASC,
    label: $localize`:@@web_catalog_filter_price_asc:Price: from low to high`,
  },
];

export interface ISort {
  value: SORT_KEYS;
  label: string;
}
