export enum VERIFICATION_METHOD {
  PHONE = 'phone',
  EMAIL = 'email',
  FACEBOOK = 'facebook',
}
export interface UserVerifications {
  email: boolean;
  phone: boolean;
  facebook: boolean;
  google_plus: boolean;
}
