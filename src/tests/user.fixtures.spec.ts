import { UserInfoResponse, UserProInfo } from '@core/user/user-info.interface';
import { Coordinate, StoreLocation } from '@core/geolocation/address-response.interface';
import { Counters, Ratings, ShippingCounterResponse, UserStats } from '@core/user/user-stats.interface';
import { UserData, UserProData, UserProDataNotifications } from '@core/user/user-data.interface';
import { UnsubscribeReason } from '@core/user/unsubscribe-reason.interface';
import { Image, UserExtrainfo, UserLocation, UserResponse, UserStatsOld, UserValidations } from '@core/user/user-response.interface';
import { Observable, of } from 'rxjs';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';

export const USER_ID = 'l1kmzn82zn3p';
export const OTHER_USER_ID = 'qxkmav12tp8f';
export const MICRO_NAME = 'String S.';
export const ACCESS_TOKEN = 'bS7D7d26UordM5M0uy5o4IisuyrPz35mfxfpw7PLRqQfzouQGXGpQtyZWFRRDdRFFT5fJZ';
export const USER_EMAIL = 'test@test.it';

export const IMAGE: Image = {
  id: '9jd7ryx5odjk',
  legacy_id: 500002512,
  original_width: 100,
  original_height: 62,
  average_hex_color: '6a707b',
  urls_by_size: {
    original: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=ORIGINAL',
    small: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    large: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    medium: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    xlarge: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
  },
};

export const IMAGE_2: Image = {
  id: 'aaaaa23323',
  legacy_id: 500002512,
  original_width: 100,
  original_height: 62,
  average_hex_color: '6a707b',
  urls_by_size: {
    original: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=ORIGINAL',
    small: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    large: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    medium: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    xlarge: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
  },
};

export const USER_LOCATION: UserLocation = {
  id: 101,
  approximated_latitude: 41.399132621722174,
  approximated_longitude: 2.17585484411869,
  city: 'Barcelona',
  zip: '08009',
  approxRadius: 0,
  title: '08009, Barcelona',
  country_code: 'ES',
};

export const STATS: UserStatsOld = {
  published: 10,
  sold: 2,
  favorites: 0,
  send_reviews: 2,
  received_reviews: 1,
  notification_read_pending: 0,
  purchased: 0,
};

export const VALIDATIONS: UserValidations = {
  email: false,
  mobile: false,
  facebook: false,
  google_plus: false,
  gender: false,
  location: true,
  picture: true,
  scoring_stars: 0,
  level: 1,
  birthday: true,
};

export const VERIFICATION_LEVEL = 1;
export const SCORING_STARS = 91;
export const SCORING_STARTS = 0;
export const RESPONSE_RATE = 'less_than_one_hour';
export const ONLINE = false;
export const RECEIVED_REPORTS = 3;
export const USER_TYPE = 'normal';
export const USER_WEB_SLUG = 'webslug-l1kmzn82zn3p';
export const USER_FIRST_NAME = 'Daniele';
export const USER_LAST_NAME = 'Ghidoli';
export const USER_BIRTH_DATE = 1523560844000;
export const USER_GENDER = 'male';
export const USER_URL = 'https://www.wallapop.com/user/webslug-l1kmzn82zn3p';
export const USER_EXTRA_INFO: UserExtrainfo = {
  description: 'description',
  phone_number: 'phone_number',
  link: 'link',
  address: USER_LOCATION.title,
  latitude: USER_LOCATION.approximated_latitude,
  longitude: USER_LOCATION.approximated_longitude,
};

export const USER_DATA: UserResponse = {
  legacy_id: 101,
  id: USER_ID,
  micro_name: MICRO_NAME,
  image: IMAGE,
  location: USER_LOCATION,
  stats: STATS,
  validations: VALIDATIONS,
  verification_level: VERIFICATION_LEVEL,
  scoring_stars: SCORING_STARS,
  scoring_starts: SCORING_STARTS,
  response_rate: RESPONSE_RATE,
  online: ONLINE,
  received_reports: RECEIVED_REPORTS,
  type: USER_TYPE,
  web_slug: USER_WEB_SLUG,
  first_name: USER_FIRST_NAME,
  last_name: USER_LAST_NAME,
  birth_date: USER_BIRTH_DATE,
  gender: USER_GENDER,
  email: USER_EMAIL,
  featured: true,
  extra_info: USER_EXTRA_INFO,
};

export const MOCK_NON_FEATURED_USER_RESPONSE: UserResponse = {
  legacy_id: 101,
  id: USER_ID,
  micro_name: MICRO_NAME,
  image: IMAGE,
  location: USER_LOCATION,
  stats: STATS,
  validations: VALIDATIONS,
  verification_level: VERIFICATION_LEVEL,
  scoring_stars: SCORING_STARS,
  scoring_starts: SCORING_STARTS,
  response_rate: RESPONSE_RATE,
  online: ONLINE,
  received_reports: RECEIVED_REPORTS,
  type: USER_TYPE,
  web_slug: USER_WEB_SLUG,
  first_name: USER_FIRST_NAME,
  last_name: USER_LAST_NAME,
  birth_date: USER_BIRTH_DATE,
  gender: USER_GENDER,
  email: USER_EMAIL,
  featured: false,
  extra_info: USER_EXTRA_INFO,
};

export const MOCK_USER_RESPONSE_BODY = {
  token: ACCESS_TOKEN,
  resetToken: 'eZXAqOYOyGK9tI4YbwI8Lsd65hs7rIN2mvQVekZ5euFDBBUMDcgJ7jbhTQ325FUA49W1j4',
  registerInfo: { userId: 500002515, userUUID: USER_ID, idUser: 500002515 },
};

export const MOCK_USER: User = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  0,
  USER_DATA.web_slug
);

export const MOCK_USER_WITHOUT_LOCATION: User = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  null,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  0,
  USER_DATA.web_slug
);

export const MOCK_OTHER_USER: User = new User(
  'other',
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  0,
  USER_DATA.web_slug
);

export const MOCK_FULL_USER = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  USER_DATA.received_reports,
  USER_DATA.web_slug,
  USER_DATA.first_name,
  USER_DATA.last_name,
  USER_DATA.birth_date,
  USER_DATA.gender,
  USER_DATA.email,
  USER_DATA.featured,
  USER_DATA.extra_info
);

export const MOCK_FULL_USER_FEATURED = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  USER_DATA.received_reports,
  USER_DATA.web_slug,
  USER_DATA.first_name,
  USER_DATA.last_name,
  USER_DATA.birth_date,
  USER_DATA.gender,
  USER_DATA.email,
  USER_DATA.featured,
  USER_DATA.extra_info,
  null
);

export const MOCK_FULL_USER_NON_FEATURED = new User(
  MOCK_NON_FEATURED_USER_RESPONSE.id,
  MOCK_NON_FEATURED_USER_RESPONSE.micro_name,
  MOCK_NON_FEATURED_USER_RESPONSE.image,
  MOCK_NON_FEATURED_USER_RESPONSE.location,
  MOCK_NON_FEATURED_USER_RESPONSE.stats,
  MOCK_NON_FEATURED_USER_RESPONSE.validations,
  MOCK_NON_FEATURED_USER_RESPONSE.verification_level,
  MOCK_NON_FEATURED_USER_RESPONSE.scoring_stars,
  MOCK_NON_FEATURED_USER_RESPONSE.scoring_starts,
  MOCK_NON_FEATURED_USER_RESPONSE.response_rate,
  MOCK_NON_FEATURED_USER_RESPONSE.online,
  MOCK_NON_FEATURED_USER_RESPONSE.type,
  MOCK_NON_FEATURED_USER_RESPONSE.received_reports,
  MOCK_NON_FEATURED_USER_RESPONSE.web_slug,
  MOCK_NON_FEATURED_USER_RESPONSE.first_name,
  MOCK_NON_FEATURED_USER_RESPONSE.last_name,
  MOCK_NON_FEATURED_USER_RESPONSE.birth_date,
  MOCK_NON_FEATURED_USER_RESPONSE.gender,
  MOCK_NON_FEATURED_USER_RESPONSE.email,
  MOCK_NON_FEATURED_USER_RESPONSE.featured,
  MOCK_NON_FEATURED_USER_RESPONSE.extra_info
);

export const MOCK_USER_PRO: User = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  'professional'
);

export const USER_ITEM_DISTANCE = 10;

export const MockUser: Partial<User> = {
  id: 'abcd-1234',
  birthDate: USER_BIRTH_DATE,
  gender: USER_GENDER,
  location: USER_LOCATION,
};

export const MockUserService = {
  user: MockUser,
  isLogged: true,
  isCurrentUser(userId: string) {
    return userId === MOCK_USER.id;
  },
  get(userId: string) {
    return of(MOCK_USER);
  },
};

export class MockedUserService {
  public get(url: string): Observable<User> {
    const data: any = USER_DATA;
    return of(
      new User(
        data.id,
        data.micro_name,
        data.image,
        data.location,
        data.stats,
        data.validations,
        data.verification_level,
        data.scoring_stars,
        data.scoring_starts,
        data.response_rate,
        data.online,
        data.type,
        0,
        data.web_slug
      )
    );
  }

  public calculateDistanceFromItem(user: User, item: Item): number {
    return USER_ITEM_DISTANCE;
  }

  get user(): User {
    return new User(USER_ID);
  }

  get isLogged(): boolean {
    return true;
  }

  get isPro(): boolean {
    return this.user.featured;
  }

  public isProfessional(): Observable<boolean> {
    return of(true);
  }

  public getPhoneInfo(userId: string) {}

  public getStats() {
    return of(MOCK_USER_STATS);
  }

  public checkUserPermissions(): Observable<boolean> {
    return of(true);
  }

  public logout(): Observable<any> {
    return of(null);
  }

  public hasStoreLocation(): boolean {
    return false;
  }
}

export const USER_INFO_RESPONSE: UserInfoResponse = {
  scoring_stars: SCORING_STARS,
  response_rate: RESPONSE_RATE,
};

export const USER_LOCATION_COORDINATES: Coordinate = {
  latitude: USER_LOCATION.approximated_latitude,
  longitude: USER_LOCATION.approximated_longitude,
  name: USER_LOCATION.title,
};

export const STORE_LOCATION: StoreLocation = {
  latitude: 41.609,
  longitude: 2.2873,
  address: 'gran via 1',
};

export const RATINGS_RESPONSE: Ratings = {
  reviews: 0,
};

export const USER_REPORTS_RECEIVED = 5;

export const COUNTERS_RESPONSE: Counters = {
  publish: 0,
  buys: 0,
  sells: 0,
  favorites: 0,
  views: 0,
  profile_favorited_received: 0,
  profile_favorited: 0,
  reviews: 0,
  sold: 0,
  reports_received: USER_REPORTS_RECEIVED,
  onHold: 0,
};

export const MOCK_USER_STATS: UserStats = {
  ratings: RATINGS_RESPONSE,
  counters: COUNTERS_RESPONSE,
};

export const MOCK_USER_SHIPPING_COUNTER: ShippingCounterResponse = {
  succeeded_count: 1,
};

export const MOCK_USER_STATS_RESPONSE = {
  ratings: [{ type: 'reviews', value: 60 }],
  counters: [
    { type: 'publish', value: 1 },
    { type: 'buys', value: 0 },
    { type: 'sells', value: 5 },
    { type: 'favorites', value: 2 },
    { type: 'views', value: 1 },
    { type: 'profile_favorited_received', value: 1 },
    { type: 'profile_favorited', value: 1 },
    { type: 'onHold', value: 10 },
    { type: 'reviews', value: 2 },
    { type: 'sold', value: 4 },
    { type: 'reports_received', value: 1 },
  ],
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
    value: USER_REPORTS_RECEIVED,
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

export const USER_EDIT_DATA: UserData = {
  first_name: USER_DATA.first_name,
  last_name: USER_DATA.last_name,
  birth_date: '2018-04-12',
  gender: USER_GENDER,
};

export const USER_PRO_DATA: UserProData = {
  description: 'description',
  opening_hours: 'opening_hours',
  phone_number: '612345678',
  link: 'wallapop.com',
};

export const USER_PRO_INFO_NOTIFICATIONS: UserProDataNotifications = {
  new_chat_notification: true,
  only_chat_phone_notification: true,
  consent_third_parties_use_data: true,
  news_notification: true,
};

export const USER_PRO_INFO_RESPONSE: UserProInfo = <UserProInfo>{
  ...USER_PRO_DATA,
  ...USER_PRO_INFO_NOTIFICATIONS,
};

export const MOCK_UNSUBSCRIBE_REASONS: UnsubscribeReason[] = [
  {
    name: 'Test',
    reason_id: 1,
  },
  {
    name: 'Test 2',
    reason_id: 2,
  },
];

export const SELECTED_REASON = 1;
export const CUSTOM_REASON = 'bye';
