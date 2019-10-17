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
  sold: number;
  reports_received: number;
  onHold: number;
  featured?: number;
}

export interface AvailableSlots {
  user_can_manage: boolean;
  num_slots_cars: number;
  num_max_cars?: number;
}
