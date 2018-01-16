import { UserInfoResponse } from '../app/core/user/user-info.interface';
import { Coordinate } from '../app/core/geolocation/address-response.interface';
import { Counters, Ratings, UserStatsResponse } from '../app/core/user/user-stats.interface';
import { USER_LOCATION, USER_DATA } from 'shield';
import { UserData } from '../app/core/user/user-data.interface';
import { UnsubscribeReason } from '../app/core/user/unsubscribe-reason.interface';

export const SCORING_STARS = 91;
export const RESPONSE_RATE = 'less_than_one_hour';

export const USER_INFO_RESPONSE: UserInfoResponse = {
  scoring_stars: SCORING_STARS,
  response_rate: RESPONSE_RATE
};

export const USER_LOCATION_COORDINATES: Coordinate = {
  latitude: USER_LOCATION.approximated_latitude,
  longitude: USER_LOCATION.approximated_longitude,
  name: USER_LOCATION.title
};

export const RATINGS_RESPONSE: Ratings = {
  reviews: 0
};

export const COUNTERS_RESPONSE: Counters = {
  publish: 0,
  buys: 0,
  sells: 0,
  favorites: 0,
  views: 0,
  profile_favorited_received: 0,
  profile_favorited: 0,
  reviews: 0
};

export const USERS_STATS_RESPONSE: UserStatsResponse = {
  ratings: RATINGS_RESPONSE,
  counters: COUNTERS_RESPONSE
};

export const RATINGS = [
  {
    type: 'reviews',
    value: 0
  }
];

export const COUNTERS = [
  {
    type: 'publish',
    value: 0
  },
  {
    type: 'buys',
    value: 0
  },
  {
    type: 'sells',
    value: 0
  },
  {
    type: 'favorites',
    value: 0
  },
  {
    type: 'views',
    value: 0
  },
  {
    type: 'profile_favorited_received',
    value: 0
  },
  {
    type: 'profile_favorited',
    value: 0
  },
  {
    type: 'reviews',
    value: 0
  }
];

export const USERS_STATS = {
  ratings: RATINGS,
  counters: COUNTERS
};

export const USER_EDIT_DATA: UserData = {
  first_name: USER_DATA.first_name,
  last_name: USER_DATA.last_name,
  birth_date: '1987-02-10T00:00:00.000Z',
  gender: 'M'
};

export const REASONS: UnsubscribeReason[] = [{
  name: 'Test',
  reason_id: 1
}, {
  name: 'Test 2',
  reason_id: 2
}];

export const SELECTED_REASON = 1;
export const CUSTOM_REASON = 'bye';
