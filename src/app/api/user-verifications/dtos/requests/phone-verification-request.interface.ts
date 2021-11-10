import { VERIFICATION_TYPE } from './verification-type.enum';

export interface PhoneVerificationBodyRequest {
  mobileNumber: string | null;
  type: VERIFICATION_TYPE;
  code: string;
}
