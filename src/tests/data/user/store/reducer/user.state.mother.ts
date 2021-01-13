import { BooleanMother } from '@fixtures/shared';
import { UserProfileState } from 'app/data/user/store/reducer/user.reducer';
import { UserMother } from '../../domain';

export class UserStateMother {
  static random(partial: Partial<UserProfileState> = {}): UserProfileState {
    return {
      userDetail: UserMother.random(),
      loading: BooleanMother.random(),
      ...partial,
    };
  }
}
