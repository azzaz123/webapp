import { BooleanMother } from '@fixtures/shared';
import { UserProfileState } from 'app/data/user/store/reducer/profile.reducer';
import { ProfileMother } from '../../domain';

export class UserProfileStateMother {
  static random(partial: Partial<UserProfileState> = {}): UserProfileState {
    return {
      userDetail: ProfileMother.random(),
      loading: BooleanMother.random(),
      ...partial,
    };
  }
}
