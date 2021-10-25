export interface WallMeta {
  next: string | null;
  order: {
    type: WALL_SORT_BY;
  };
}

export enum WALL_SORT_BY {
  DISTANCE = 'distance',
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  NEWEST = 'newest',
}
