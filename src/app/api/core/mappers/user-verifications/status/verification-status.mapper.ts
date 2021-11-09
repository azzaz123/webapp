import { VERIFICATION_STATUS } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { VERIFICATION_STATUS_API } from '@api/user-verifications/dtos/responses';

export const mapVerificationStatusApiToVerificationStatus: ToDomainMapper<VERIFICATION_STATUS_API, VERIFICATION_STATUS> = (
  verificationStatus: VERIFICATION_STATUS_API
): VERIFICATION_STATUS => {
  const verifications_mapper = {
    [VERIFICATION_STATUS_API.EXHAUSTED]: VERIFICATION_STATUS.EXHAUSTED,
    [VERIFICATION_STATUS_API.NOT_VERIFIED]: VERIFICATION_STATUS.NOT_VERIFIED,
    [VERIFICATION_STATUS_API.SENT]: VERIFICATION_STATUS.SENT,
    [VERIFICATION_STATUS_API.SMS_VERIFIED]: VERIFICATION_STATUS.VERIFIED,
  };

  return verifications_mapper[verificationStatus];
};
