import { UserVerifications } from '@api/core/model/verifications';
import { ToDomainMapper } from '@api/core/utils/types';
import { UserVerificationsApi } from '../dtos/user-verifications-api.interface';

export const mapUserVerificationsApiToUserVerifications: ToDomainMapper<UserVerificationsApi, UserVerifications> = (
  input: UserVerificationsApi
): UserVerifications => {
  const { validations } = input;

  return {
    email: validations.email,
    phone: validations.mobile,
    facebook: validations.facebook,
    google_plus: validations.google_plus,
  };
};
