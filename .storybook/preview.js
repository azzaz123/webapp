
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

const CUSTOM_VIEWPORTS = { // Based on chrome responsive tool
  LG: {
    name: 'LG',
    styles: {
      width: '1140px',
      height: '930px',
    },
  },
  MD: {
    name: 'MD',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  SM: {
    name: 'MD',
    styles: {
      width: '576px',
      height: '667px',
    },
  },
  XS: {
    name: 'XS',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
};


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  viewport: { viewports: {
   ...CUSTOM_VIEWPORTS,
 }, },
}