import { CUSTOM_VIEWPORTS } from './viewports/custom-viewports';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: {
      ...CUSTOM_VIEWPORTS,
    },
  },
};
