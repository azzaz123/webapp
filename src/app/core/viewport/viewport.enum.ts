export interface Viewport {
  type: ViewportType;
  minWidth: number;
}

export enum ViewportType {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

export const viewports: Viewport[] = [
  {
    type: ViewportType.XS,
    minWidth: 0,
  },
  {
    type: ViewportType.SM,
    minWidth: 576,
  },
  {
    type: ViewportType.MD,
    minWidth: 768,
  },
  {
    type: ViewportType.LG,
    minWidth: 992,
  },
  {
    type: ViewportType.XL,
    minWidth: 1200,
  },
  {
    type: ViewportType.XXL,
    minWidth: 1400,
  },
];
