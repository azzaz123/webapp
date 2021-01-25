export enum SIZE {
  SMALL = 'small',
  BIG = 'big',
}

export interface StyleProperties {
  size: SIZE;
  imageSize: number;
  fontSize: string;
}

export const STYLE_SIZES: StyleProperties[] = [
  {
    size: SIZE.SMALL,
    imageSize: 40,
    fontSize: '18px',
  },
  {
    size: SIZE.BIG,
    imageSize: 80,
    fontSize: '19px',
  },
];
