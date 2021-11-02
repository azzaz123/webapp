export enum EMAIL_VERIFICATION_STATUS_API {
  NOT_VERIFIED = 0,
  SENT = 10,
  SMS_VERIFIED = 30,
  EXHAUSTED = 40,
}
export interface EmailVerificationApi {
  emailVerifiedStatus: EMAIL_VERIFICATION_STATUS_API;
}
