import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';

export const SORT_BY_RELEVANCE_OPTION: SelectFormOption<string> = {
  label: $localize`:@@web_filter_sort_by_relevance:Relevance`,
  icon: '/assets/icons/filters/sort-by-relevance.svg',
  value: 'relevance',
};

export const SELECT_FORM_OPTIONS_CONFIG: SelectFormOption<string>[] = [
  {
    label: $localize`:@@web_filter_sort_by_distance:Distance`,
    icon: '/assets/icons/filters/location.svg',
    value: 'default',
  },
  {
    label: $localize`:@@web_filter_sort_by_price_low_high:Price low to high`,
    icon: '/assets/icons/filters/sort-by-asc.svg',
    value: 'price_low_to_high',
  },
  {
    label: $localize`:@@web_filter_sort_by_price_high_low:Price high to low`,
    icon: '/assets/icons/filters/sort-by-desc.svg',
    value: 'price_high_to_low',
  },
  {
    label: $localize`:@@web_filter_sort_by_newest:Newest first`,
    icon: '/assets/icons/filters/calendar.svg',
    value: 'newest',
  },
];
