import { UserInfoResponse } from '../app/core/user/user-info.interface';

export const SCORING_STARS = 91;
export const RESPONSE_RATE = 'less_than_one_hour';

export const USER_INFO_RESPONSE: UserInfoResponse = {
  scoring_stars: SCORING_STARS,
  response_rate: RESPONSE_RATE
};
