export enum USER_INFO_SIZE {
  SMALL = 'small',
  BIG = 'big',
}

export interface StyleProperties {
  size: USER_INFO_SIZE;
  imageSize: number;
}

export const STYLE_SIZES: StyleProperties[] = [
  {
    size: USER_INFO_SIZE.SMALL,
    imageSize: 40,
  },
  {
    size: USER_INFO_SIZE.BIG,
    imageSize: 80,
  },
];
