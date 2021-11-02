import { USER_VERIFIED_INFO_STATUS_API } from './user-verified-info-status-api.enum';

export interface EmailVerificationApi {
  emailVerifiedStatus: USER_VERIFIED_INFO_STATUS_API;
}
