import { BooleanMother } from '@fixtures/shared';
import { User } from 'app/data/user/domain';
import { UserProfileState } from 'app/data/user/store/reducer/user.reducer';
import {
  selectUserProfileDetail,
  selectUserProfileIsAuthenticated,
  selectUserProfileLoading,
} from 'app/data/user/store/selectors';
import { UserStateMother } from '../reducer/user.state.mother';
import { UserMother } from './../../domain/user.mother';

describe('UserSelector', () => {
  describe('selectUserProfileDetail', () => {
    it('should return a user Detail', () => {
      const user: User = UserMother.random();
      const state: UserProfileState = UserStateMother.random({
        userDetail: user,
      });

      const select = selectUserProfileDetail.projector(state);

      expect(select).toEqual(user);
    });
  });

  describe('selectUserProfileLoading', () => {
    it('should return is is loading', () => {
      const loading: boolean = BooleanMother.random();
      const state: UserProfileState = UserStateMother.random({ loading });

      const select = selectUserProfileLoading.projector(state);

      expect(select).toBe(loading);
    });
  });

  describe('selectUserProfileIsAuthenticated', () => {
    it('should return authenticated if there is an user', () => {
      const user: User = UserMother.random();
      const state: UserProfileState = UserStateMother.random({
        userDetail: user,
      });

      const select = selectUserProfileIsAuthenticated.projector(state);

      expect(select).toBe(true);
    });

    it('should return not authenticated if there is not an user', () => {
      const state: UserProfileState = UserStateMother.random({
        userDetail: null,
      });

      const select = selectUserProfileIsAuthenticated.projector(state);

      expect(select).toBe(false);
    });
  });
});
