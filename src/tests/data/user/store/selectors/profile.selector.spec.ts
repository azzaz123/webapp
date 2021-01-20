import { selectUserProfileDetailId } from './../../../../../app/data/user/store/selectors/profile.selector';
import { BooleanMother } from '@fixtures/shared';
import { Profile } from 'app/data/user/domain';
import { UserProfileState } from 'app/data/user/store/reducer/profile.reducer';
import {
  selectUserProfileDetail,
  selectUserProfileIsAuthenticated,
  selectUserProfileLoading,
} from 'app/data/user/store/selectors';
import { UserProfileStateMother } from '../reducer/user.state.mother';
import { ProfileMother } from '../../domain/profile/profile.mother';

describe('ProfileSelector', () => {
  describe('selectUserProfileDetail', () => {
    it('should receive the user profile', () => {
      const user: Profile = ProfileMother.random();
      const state: UserProfileState = UserProfileStateMother.random({
        userDetail: user,
      });

      const select = selectUserProfileDetail.projector(state);

      expect(select).toEqual(user);
    });
  });

  describe('selectUserProfileDetailId', () => {
    it('should receive the user id profile', () => {
      const user: Profile = ProfileMother.random();

      const select = selectUserProfileDetailId.projector(user);

      expect(select).toEqual(user.id);
    });
  });

  describe('selectUserProfileLoading', () => {
    it('should receive if is loading or not', () => {
      const loading: boolean = BooleanMother.random();
      const state: UserProfileState = UserProfileStateMother.random({
        loading,
      });

      const select = selectUserProfileLoading.projector(state);

      expect(select).toBe(loading);
    });
  });

  describe('selectUserProfileIsAuthenticated', () => {
    it('should receive if there is an user authenticated', () => {
      const user: Profile = ProfileMother.random();
      const state: UserProfileState = UserProfileStateMother.random({
        userDetail: user,
      });

      const select = selectUserProfileIsAuthenticated.projector(state);

      expect(select).toBe(true);
    });

    it('should received if there is not an user authenticated', () => {
      const state: UserProfileState = UserProfileStateMother.random({
        userDetail: null,
      });

      const select = selectUserProfileIsAuthenticated.projector(state);

      expect(select).toBe(false);
    });
  });
});
