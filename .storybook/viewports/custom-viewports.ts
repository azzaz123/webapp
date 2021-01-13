export enum CUSTOM_VIEWPORT_NAME {
  LG = 'LG',
  MD = 'MD',
  SM = 'SM',
  XS = 'XS',
}

export const CUSTOM_VIEWPORTS = {
  // Based on chrome responsive tool
  [CUSTOM_VIEWPORT_NAME.LG]: {
    name: CUSTOM_VIEWPORT_NAME.LG,
    styles: {
      width: '1140px',
      height: '930px',
    },
  },
  [CUSTOM_VIEWPORT_NAME.MD]: {
    name: CUSTOM_VIEWPORT_NAME.MD,
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  [CUSTOM_VIEWPORT_NAME.SM]: {
    name: CUSTOM_VIEWPORT_NAME.SM,
    styles: {
      width: '576px',
      height: '667px',
    },
  },
  [CUSTOM_VIEWPORT_NAME.XS]: {
    name: CUSTOM_VIEWPORT_NAME.XS,
    styles: {
      width: '375px',
      height: '667px',
    },
  },
};
