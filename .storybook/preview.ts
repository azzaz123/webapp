import { CUSTOM_VIEWPORTS } from './viewports/custom-viewports';

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
