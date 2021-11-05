import { VERIFICATION_TYPE } from './verification-type.enum';

export interface PhoneVerificationBodyRequest {
  mobileNumber: string;
  type: VERIFICATION_TYPE;
  code: string;
}
