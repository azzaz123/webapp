import { MultiSelectFormOption, TemplateMultiSelectFormOption } from '../interfaces/multi-select-form-option.interface';

export const optionsFixture: MultiSelectFormOption[] = [
  { label: 'aa', value: 'aa', icon: '', sublabel: '' },
  { label: 'bb', value: 'bb', icon: '', sublabel: '' },
  { label: 'cc', value: 'cc', icon: '', sublabel: '' },
  { label: 'dd', value: 'dd', icon: '', sublabel: '' },
];

export const extendedOptionsFixture: TemplateMultiSelectFormOption[] = [
  { label: 'aa', value: 'aa', icon: '', sublabel: '', checked: false },
  { label: 'bb', value: 'bb', icon: '', sublabel: '', checked: true },
  { label: 'cc', value: 'cc', icon: '', sublabel: '', checked: true },
  { label: 'dd', value: 'dd', icon: '', sublabel: '', checked: false },
];

export const optionsWithChildrenFixture: MultiSelectFormOption[] = [
  {
    label: 'aa',
    value: 'aa',
    icon: '',
    sublabel: '',
    children: [
      { label: 'aa1', value: 'aa1', icon: '', sublabel: '' },
      { label: 'aa2', value: 'aa2', icon: '', sublabel: '' },
      { label: 'aa3', value: 'aa3', icon: '', sublabel: '' },
    ],
  },
  { label: 'bb', value: 'bb', icon: '', sublabel: '' },
  {
    label: 'cc',
    value: 'cc',
    icon: '',
    sublabel: '',
    children: [
      { label: 'cc1', value: 'cc1', icon: '', sublabel: '' },
      { label: 'cc2', value: 'cc2', icon: '', sublabel: '' },
    ],
  },
  { label: 'dd', value: 'dd', icon: '', sublabel: '' },
];

export const extendedOptionsWithChildrenFixture: TemplateMultiSelectFormOption[] = [
  {
    label: 'aa',
    value: 'aa',
    checked: false,
    icon: '',
    sublabel: '',
    children: [
      { label: 'aa1', value: 'aa1', icon: '', sublabel: '', checked: false },
      { label: 'aa2', value: 'aa2', icon: '', sublabel: '', checked: true },
      { label: 'aa3', value: 'aa3', icon: '', sublabel: '', checked: false },
    ],
  },
  { label: 'bb', value: 'bb', icon: '', sublabel: '', checked: true },
  {
    label: 'cc',
    value: 'cc',
    checked: false,
    icon: '',
    sublabel: '',
    children: [
      { label: 'cc1', value: 'cc1', icon: '', sublabel: '', checked: true },
      { label: 'cc2', value: 'cc2', icon: '', sublabel: '', checked: true },
    ],
  },
  { label: 'dd', value: 'dd', icon: '', sublabel: '', checked: false },
];
