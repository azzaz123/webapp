import { VERIFICAITON_TYPE } from './verification-type.enum';

export interface PhoneVerificationBodyRequest {
  mobileNumber: string;
  type: VERIFICAITON_TYPE;
  code: string;
}
