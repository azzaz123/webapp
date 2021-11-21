import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export enum SORT_KEYS {
  DATE_DESC = 'date_desc',
  DATE_ASC = 'date_asc',
  PRICE_DESC = 'price_desc',
  PRICE_ASC = 'price_asc',
}
export const SORTS: ISort[] = [
  {
    value: SORT_KEYS.DATE_DESC,
    label: TRANSLATION_KEY.DATE_DESC,
  },
  {
    value: SORT_KEYS.DATE_ASC,
    label: TRANSLATION_KEY.DATE_ASC,
  },
  {
    value: SORT_KEYS.PRICE_DESC,
    label: TRANSLATION_KEY.PRICE_DESC,
  },
  {
    value: SORT_KEYS.PRICE_ASC,
    label: TRANSLATION_KEY.PRICE_ASC,
  },
];

export interface ISort {
  value: SORT_KEYS;
  label: TRANSLATION_KEY;
}
