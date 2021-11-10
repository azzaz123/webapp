import { environment } from '@environments/environment';

export const EXTRA_INFO_ENDPOINT = `${environment.baseUrl}api/v3/users/me/extra-info`;
export const SEND_VERIFY_EMAIL_ENDPOINT = `${environment.baseUrl}shnm-portlet/api/v1/access.json/sendVerifyEmail`;
export const SEND_VERIFY_PHONE_ENDPOINT = `${environment.baseUrl}shnm-portlet/api/v1/access.json/sendVerifyMobile`;
export const VERIFY_USER_ENDPOINT = `${environment.baseUrl}shnm-portlet/api/v1/access.json/verifyUser`;
