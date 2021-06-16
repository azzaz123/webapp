import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';

export enum SORT_BY {
  RELEVANCE = 'most_relevance',
  DEFAULT = 'default',
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  NEWEST = 'newest',
}

export const SORT_BY_RELEVANCE_OPTION: SelectFormOption<string> = {
  label: $localize`:@@web_filter_sort_by_relevance:Relevance`,
  icon: '/assets/icons/filters/sort-by-relevance.svg',
  value: SORT_BY.RELEVANCE,
};

export const SELECT_FORM_OPTIONS_CONFIG: SelectFormOption<SORT_BY>[] = [
  {
    label: $localize`:@@web_filter_sort_by_distance:Distance`,
    icon: '/assets/icons/filters/location.svg',
    value: SORT_BY.DEFAULT,
  },
  {
    label: $localize`:@@web_filter_sort_by_price_low_high:Price low to high`,
    icon: '/assets/icons/filters/sort-by-asc.svg',
    value: SORT_BY.PRICE_LOW_TO_HIGH,
  },
  {
    label: $localize`:@@web_filter_sort_by_price_high_low:Price high to low`,
    icon: '/assets/icons/filters/sort-by-desc.svg',
    value: SORT_BY.PRICE_HIGH_TO_LOW,
  },
  {
    label: $localize`:@@web_filter_sort_by_newest:Newest first`,
    icon: '/assets/icons/filters/calendar.svg',
    value: SORT_BY.NEWEST,
  },
];
