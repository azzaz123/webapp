import { MultiSelectFormOption, TemplateMultiSelectFormOption } from '../interfaces/multi-select-form-option.interface';

export const optionsFixture: MultiSelectFormOption[] = [
  { label: 'aa', value: 'aa', icon: '' },
  { label: 'bb', value: 'bb', icon: '' },
  { label: 'cc', value: 'cc', icon: '' },
  { label: 'dd', value: 'dd', icon: '' },
];

export const extendedOptionsFixture: TemplateMultiSelectFormOption[] = [
  { label: 'aa', value: 'aa', icon: '', checked: false },
  { label: 'bb', value: 'bb', icon: '', checked: true },
  { label: 'cc', value: 'cc', icon: '', checked: true },
  { label: 'dd', value: 'dd', icon: '', checked: false },
];

export const optionsWithChildrenFixture: MultiSelectFormOption[] = [
  {
    label: 'aa',
    value: 'aa',
    icon: '',
    children: [
      { label: 'aa1', value: 'aa1', icon: '' },
      { label: 'aa2', value: 'aa2', icon: '' },
      { label: 'aa3', value: 'aa3', icon: '' },
    ],
  },
  { label: 'bb', value: 'bb', icon: '' },
  {
    label: 'cc',
    value: 'cc',
    icon: '',
    children: [
      { label: 'cc1', value: 'cc1', icon: '' },
      { label: 'cc2', value: 'cc2', icon: '' },
    ],
  },
  { label: 'dd', value: 'dd', icon: '' },
];

export const extendedOptionsWithChildrenFixture: TemplateMultiSelectFormOption[] = [
  {
    label: 'aa',
    value: 'aa',
    checked: false,
    icon: '',
    children: [
      { label: 'aa1', value: 'aa1', icon: '', checked: false },
      { label: 'aa2', value: 'aa2', icon: '', checked: true },
      { label: 'aa3', value: 'aa3', icon: '', checked: false },
    ],
  },
  { label: 'bb', value: 'bb', icon: '', checked: true },
  {
    label: 'cc',
    value: 'cc',
    checked: false,
    icon: '',
    children: [
      { label: 'cc1', value: 'cc1', icon: '', checked: true },
      { label: 'cc2', value: 'cc2', icon: '', checked: true },
    ],
  },
  { label: 'dd', value: 'dd', icon: '', checked: false },
];
