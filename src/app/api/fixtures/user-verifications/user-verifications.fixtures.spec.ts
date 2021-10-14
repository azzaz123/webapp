import { UserVerifications } from '@api/core/model/verifications';
import { UserVerificationsApi } from '@api/user-verifications/dtos';

export const MOCK_USER_VERIFICATIONS_API_RESPONSE: UserVerificationsApi = {
  scoring_stars: 0.0,
  validations: {
    email: false,
    mobile: true,
    facebook: false,
    google_plus: false,
    linkedin: false,
    gender: false,
    location: false,
    picture: false,
    level: 'partially_verified',
    birthday: false,
  },
  activity_level: 'unknown',
};

export const MOCK_USER_VERIFICATIONS_MAPPED: UserVerifications = {
  email: false,
  mobile: true,
  facebook: false,
  google_plus: false,
};

export const MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED: UserVerifications = {
  email: true,
  mobile: true,
  facebook: false,
  google_plus: false,
};
