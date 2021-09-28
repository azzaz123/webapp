import { UserVerifications } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { VerificationsApi } from '../dtos/verifications-api.interface';

export const mapVerificationsApiToVerifications: ToDomainMapper<VerificationsApi, UserVerifications> = (
  input: VerificationsApi
): UserVerifications => {
  const { validations } = input;

  return {
    email: validations.email,
    mobile: validations.mobile,
    facebook: validations.facebook,
    google_plus: validations.google_plus,
  };
};
