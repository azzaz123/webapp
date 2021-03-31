import { Counters, Ratings, UserStatsWithShipping } from '@core/user/user-stats.interface';

export const EMPTY_RATINGS: Ratings = {
  reviews: 0,
};

export const EMPTY_USER_REPORTS_RECEIVED = 0;

export const EMPTY_COUNTERS: Counters = {
  publish: 0,
  buys: 0,
  sells: 0,
  favorites: 0,
  views: 0,
  profile_favorited_received: 0,
  profile_favorited: 0,
  reviews: 0,
  sold: 0,
  reports_received: EMPTY_USER_REPORTS_RECEIVED,
  onHold: 0,
};

export const EMPTY_STATS: UserStatsWithShipping = {
  ratings: EMPTY_RATINGS,
  counters: EMPTY_COUNTERS,
  shippingCounter: 0,
};
