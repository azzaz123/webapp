import { VERIFICATION_STATUS } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { VERIFICATION_STATUS_API } from '@api/user-verifications/dtos/responses';

export const mapVerificationStatusApiToVerificationStatus: ToDomainMapper<VERIFICATION_STATUS_API, VERIFICATION_STATUS> = (
  input: VERIFICATION_STATUS_API
): VERIFICATION_STATUS => {
  const status = VERIFICATION_STATUS_API[input];
  return VERIFICATION_STATUS[status as keyof VERIFICATION_STATUS];
};
