import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { SORT_BY } from '@api/core/model';

export const SORT_BY_RELEVANCE_OPTION: SelectFormOption<SORT_BY> = {
  label: $localize`:@@web_filter_sort_by_relevance:Relevance`,
  icon: '/assets/icons/filters/sort-by-relevance.svg',
  value: SORT_BY.RELEVANCE,
};

export const SORT_BY_DISTANCE_OPTION: SelectFormOption<SORT_BY> = {
  label: $localize`:@@web_filter_sort_by_distance:Distance`,
  icon: '/assets/icons/filters/location.svg',
  value: SORT_BY.DISTANCE,
};

export const SORT_BY_PRICE_LOW_TO_HIGH_OPTION: SelectFormOption<SORT_BY> = {
  label: $localize`:@@web_filter_sort_by_price_low_high:Price low to high`,
  icon: '/assets/icons/filters/sort-by-asc.svg',
  value: SORT_BY.PRICE_LOW_TO_HIGH,
};

export const SORT_BY_PRICE_HIGH_TO_LOW_OPTION: SelectFormOption<SORT_BY> = {
  label: $localize`:@@web_filter_sort_by_price_high_low:Price high to low`,
  icon: '/assets/icons/filters/sort-by-desc.svg',
  value: SORT_BY.PRICE_HIGH_TO_LOW,
};

export const SORT_BY_NEWEST_OPTION: SelectFormOption<SORT_BY> = {
  label: $localize`:@@web_filter_sort_by_newest:Newest first`,
  icon: '/assets/icons/filters/calendar.svg',
  value: SORT_BY.NEWEST,
};

export const SORT_BY_DEFAULT_OPTIONS: SelectFormOption<SORT_BY>[] = [
  SORT_BY_DISTANCE_OPTION,
  SORT_BY_PRICE_LOW_TO_HIGH_OPTION,
  SORT_BY_PRICE_HIGH_TO_LOW_OPTION,
  SORT_BY_NEWEST_OPTION,
];

export const SORT_BY_RELEVANCE_OPTIONS: SelectFormOption<SORT_BY>[] = [
  SORT_BY_RELEVANCE_OPTION,
  SORT_BY_DISTANCE_OPTION,
  SORT_BY_PRICE_LOW_TO_HIGH_OPTION,
  SORT_BY_PRICE_HIGH_TO_LOW_OPTION,
  SORT_BY_NEWEST_OPTION,
];
