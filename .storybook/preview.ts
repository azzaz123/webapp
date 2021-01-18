import { CUSTOM_VIEWPORTS } from './viewports/custom-viewports';
import '../src/polyfills';
import '../src/style/styles.scss';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: {
      ...CUSTOM_VIEWPORTS,
    },
  },
};
