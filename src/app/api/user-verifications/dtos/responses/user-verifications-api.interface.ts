export type ActivityLevelApi = 'unknown' | 'inactive' | 'active' | 'novice' | 'exploring' | 'loyal' | 'lapsing';

export type ValidationsLevelApi = 'not_verified' | 'partially_verified' | 'verified';

export interface UserVerificationsApi {
  activity_level: ActivityLevelApi;
  scoring_stars: number;
  validations: {
    birthday: boolean;
    email: boolean;
    facebook: boolean;
    gender: boolean;
    google_plus: boolean;
    level: ValidationsLevelApi;
    linkedin: boolean;
    location: boolean;
    mobile: boolean;
    picture: boolean;
  };
}
