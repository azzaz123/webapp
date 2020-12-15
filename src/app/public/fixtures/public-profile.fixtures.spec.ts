import {
  UserStats,
  UserInfo,
  UserLocation,
  Image,
} from '@public/features/public-profile/core/public-profile.interface';

export const USER_ID = '1uq3921a';
export const USER_NAME = 'Name';
export const USER_GENDER = 'female';
export const USER_TYPE = 'normal';
export const USER_REGISTER_DATE = 1523560844000;
export const USER_WEB_SLUG = 'webslug-l1kmzn82zn3p';
export const USER_URL_SHARE = 'http://wallapop.com/urlshare';

export const USER_LOCATION: UserLocation = {
  approxRadius: 0,
  approximated_latitude: 41.399132621722174,
  approximated_location: false,
  approximated_longitude: 2.17585484411869,
  city: 'Barcelona',
  zip: '08009',
};

export const IMAGE: Image = {
  id: '9jd7ryx5odjk',
  legacy_id: 500002512,
  original_width: 100,
  original_height: 62,
  urls_by_size: {
    original:
      'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=ORIGINAL',
    small:
      'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    large:
      'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    medium:
      'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    xlarge:
      'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    xmall:
      'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
  },
};

export const MOCK_USER_STATS: UserStats = {
  counters: {
    publish: 0,
    buys: 0,
    sells: 0,
    favorites: 0,
    views: 0,
    profile_favorited_received: 0,
    profile_favorited: 0,
    reviews: 0,
    sold: 0,
    reports_received: 5,
    onHold: 0,
  },
  ratings: {
    reviews: 0,
  },
};

export const MOCK_USER_INFO: UserInfo = {
  featured: false,
  gender: USER_GENDER,
  id: USER_ID,
  location: USER_LOCATION,
  micro_name: USER_NAME,
  register_date: USER_REGISTER_DATE,
  type: USER_TYPE,
  url_share: USER_URL_SHARE,
  web_slug: USER_WEB_SLUG,
  isPro: false,
  image: IMAGE,
};

export const RATINGS = [
  {
    type: 'reviews',
    value: 0,
  },
];

export const COUNTERS = [
  {
    type: 'publish',
    value: 0,
  },
  {
    type: 'buys',
    value: 0,
  },
  {
    type: 'sells',
    value: 0,
  },
  {
    type: 'favorites',
    value: 0,
  },
  {
    type: 'views',
    value: 0,
  },
  {
    type: 'profile_favorited_received',
    value: 0,
  },
  {
    type: 'profile_favorited',
    value: 0,
  },
  {
    type: 'reviews',
    value: 0,
  },
  {
    type: 'sold',
    value: 0,
  },
  {
    type: 'reports_received',
    value: 5,
  },
  {
    type: 'onHold',
    value: 0,
  },
];

export const USERS_STATS = {
  ratings: RATINGS,
  counters: COUNTERS,
};
