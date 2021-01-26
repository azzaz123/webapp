import { CUSTOM_VIEWPORTS } from './viewports/custom-viewports';
import '../src/polyfills';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'light',
  },
  viewport: {
    viewports: {
      ...CUSTOM_VIEWPORTS,
    },
  },
};
