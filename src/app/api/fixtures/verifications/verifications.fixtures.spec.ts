import { UserVerifications } from '@api/core/model/verifications';
import { VerificationsApi } from '@api/verifications/dtos';

export const MOCK_VERIFICATIONS_RESPONSE: VerificationsApi = {
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

export const MOCK_VERIFICATIONS_MAPPED: UserVerifications = {
  email: false,
  mobile: true,
  facebook: false,
  google_plus: false,
};
