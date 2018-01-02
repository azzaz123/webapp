import { UserInfoResponse } from '../app/core/user/user-info.interface';
import { Coordinate } from '../app/core/geolocation/address-response.interface';
import { USER_LOCATION, USER_DATA } from 'shield';
import { UserData } from '../app/core/user/user-data.interface';

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

export const USER_EDIT_DATA: UserData = {
  first_name: USER_DATA.first_name,
  last_name: USER_DATA.last_name,
  birth_date: '1987-02-10T00:00:00.000Z',
  gender: 'M'
};
