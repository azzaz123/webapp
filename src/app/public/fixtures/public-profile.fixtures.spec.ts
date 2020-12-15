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
    xsmall:
      'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
  },
};

export const MOCK_USER_STATS: UserStats = {
  counters: {
    publish: 1,
    buys: 4,
    sells: 1,
    reviews: 1,
    sold: 1,
    reports_received: 1,
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
