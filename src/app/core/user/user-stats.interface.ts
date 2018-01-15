export interface UserStatsResponse {
  ratings: Ratings;
  counters: Counters;
}

export interface Ratings {
  reviews: number;
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
}
