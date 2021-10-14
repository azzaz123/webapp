export enum EMAIL_VERIFICATION_STATUS {
  NOT_VERIFIED = 'not_verified',
  SENT = 'sent',
  SMS_VERIFIED = 'sms_verified',
  EXHAUSTED = 'exhausted',
}

export interface EmailVerification {
  status: EMAIL_VERIFICATION_STATUS;
}
