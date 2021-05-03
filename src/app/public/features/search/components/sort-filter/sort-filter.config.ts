import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';

export const SELECT_FORM_OPTIONS_CONFIG: SelectFormOption<string>[] = [
  {
    label: 'Distancia',
    icon: '/assets/icons/filters/location.svg',
    value: 'default',
  },
  {
    label: 'De más barato a más caro',
    icon: '/assets/icons/filters/sort-by-asc.svg',
    value: 'price_low_to_high',
  },
  {
    label: 'De más caro a más barato',
    icon: '/assets/icons/filters/sort-by-desc.svg',
    value: 'price_high_to_low',
  },
  {
    label: 'Novedades',
    icon: '/assets/icons/filters/calendar.svg',
    value: 'newest',
  },
];
