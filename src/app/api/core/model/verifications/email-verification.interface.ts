export enum EMAIL_VERIFICATION_STATUS {
  NOT_VERIFIED,
  SENT,
  SMS_VERIFIED,
  EXHAUSTED,
}

export interface EmailVerification {
  status: EMAIL_VERIFICATION_STATUS;
}
