export interface VerificationsApi {
  activity_level: string;
  scoring_stars: number;
  validations: {
    birthday: boolean;
    email: boolean;
    facebook: boolean;
    gender: boolean;
    google_plus: boolean;
    level: string;
    linkedin: boolean;
    location: boolean;
    mobile: boolean;
    picture: boolean;
  };
}
