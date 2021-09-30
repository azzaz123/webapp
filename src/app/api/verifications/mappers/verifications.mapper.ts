import { UserVerifications } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { UserVerificationsApi } from '../dtos/user-verifications-api.interface';

export const mapVerificationsApiToVerifications: ToDomainMapper<UserVerificationsApi, UserVerifications> = (
  input: UserVerificationsApi
): UserVerifications => {
  const { validations } = input;

  return {
    email: validations.email,
    mobile: validations.mobile,
    facebook: validations.facebook,
    google_plus: validations.google_plus,
  };
};
