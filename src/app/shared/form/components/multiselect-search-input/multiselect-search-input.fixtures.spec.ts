export const HASHTAG_TESTING = { isValid: ['', '#', '123', '#a', 'Ç', '3ab'], isNotValid: ['_', '.', '#a#', '# ', '##ff', ' ', '##'] };
export const INITIAL_HASHTAGS = ['#aa', '#ss', '#design'];

export const HASHTAG_OPTIONS = [
  { label: '#k', sublabel: '0', value: '#k' },
  { label: '#kartell', sublabel: '0', value: '#kartell' },
  { label: '#kids', sublabel: '0', value: '#kids' },
  { label: '#kidsfashion', sublabel: '0', value: '#kidsfashion' },
];

export const HASHTAG_EXTENDED_OPTIONS = [
  { label: '#k', sublabel: '0', value: '#k', checked: false },
  { label: '#kartell', sublabel: '0', value: '#kartell', checked: true },
  { label: '#kids', sublabel: '0', value: '#kids', checked: false },
  { label: '#kidsfashion', sublabel: '0', value: '#kidsfashion', checked: true },
];
