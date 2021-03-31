export interface UserStats {
  ratings: Ratings;
  counters: Counters;
}

export interface UserStatsWithShipping extends UserStats {
  shippingCounter: number;
}

export interface UserStatsResponse {
  ratings: [{ type: string; value: number }];
  counters: [{ type: string; value: number }];
}

export interface Ratings {
  reviews: number;
}

export interface ShippingCounterResponse {
  succeeded_count: number;
}
export interface Counters {
  publish: number;
  buys: number;
  sells: number;
  favorites: number;
  views: number;
  profile_favorited_received: number;
  profile_favorited: number;
  reviews: number;
  sold: number;
  reports_received: number;
  onHold: number;
  featured?: number;
}
