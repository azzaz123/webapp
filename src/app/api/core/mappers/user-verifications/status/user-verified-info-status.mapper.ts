import { USER_VERIFIED_INFO_STATUS } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { USER_VERIFIED_INFO_STATUS_API } from '@api/user-verifications/dtos/responses';

export const mapUserVerifiedInfoStatusApiToUserVerifiedInfoStatus: ToDomainMapper<
  USER_VERIFIED_INFO_STATUS_API,
  USER_VERIFIED_INFO_STATUS
> = (input: USER_VERIFIED_INFO_STATUS_API): USER_VERIFIED_INFO_STATUS => {
  const status = USER_VERIFIED_INFO_STATUS_API[input];
  return USER_VERIFIED_INFO_STATUS[status as keyof USER_VERIFIED_INFO_STATUS];
};
