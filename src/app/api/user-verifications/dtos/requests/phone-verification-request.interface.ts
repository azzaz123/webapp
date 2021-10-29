export const TYPE_VERIFICATION_PHONE = 2;

export interface PhoneVerificationBodyRequest {
  mobileNumber: string;
  type: number;
  code: string;
}
