export interface WallMeta {
  next: string | null;
  order: {
    type: 'distance' | 'price_low_to_high' | 'price_high_to_low' | 'newest';
  };
}
