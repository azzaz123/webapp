import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { CUSTOM_VIEWPORTS } from './viewports/custom-viewports';

setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: {
      ...CUSTOM_VIEWPORTS,
    },
  },
};
