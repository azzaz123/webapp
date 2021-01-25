export enum SIZE {
  SMALL = 'small',
  BIG = 'big',
}

export interface StyleProperties {
  size: SIZE;
  imageSize: number;
}

export const STYLE_SIZES: StyleProperties[] = [
  {
    size: SIZE.SMALL,
    imageSize: 40,
  },
  {
    size: SIZE.BIG,
    imageSize: 80,
  },
];
