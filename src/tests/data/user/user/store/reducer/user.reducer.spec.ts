import { UserMother } from './../../domain/user.mother';
import {
  LoadUserProfile,
  LoadUserProfileSuccess,
  LoadUserProfileFailed,
} from 'app/data/user/user/actions/user.action';
import * as fromReducer from 'app/data/user/user/store/reducer/user.reducer';
import { User } from '@data/user';

describe('User Reducer', () => {
  describe('Unkown action', () => {
    it('should return a default value', () => {
      const { INITIAL_STATE } = fromReducer;

      const action = {
        type: 'Unkown',
      };

      const state = fromReducer.userReducer(INITIAL_STATE, action);

      expect(state).toEqual(INITIAL_STATE);
    });
  });

  describe('Load User Profile', () => {
    it('should set loading true when load user profile', () => {
      const { INITIAL_STATE } = fromReducer;

      const state = fromReducer.userReducer(INITIAL_STATE, LoadUserProfile());

      expect(state).toEqual({ ...INITIAL_STATE, loading: true });
    });

    it('should set user and authenticated when user is loaded successfully', () => {
      const { INITIAL_STATE } = fromReducer;
      const userDetail: User = UserMother.random();

      let state = fromReducer.userReducer(INITIAL_STATE, LoadUserProfile());
      state = fromReducer.userReducer(
        state,
        LoadUserProfileSuccess({ user: userDetail })
      );

      expect(state).toEqual({
        userDetail,
        loading: false,
        isAuthenticated: true,
      });
    });

    it('should set initial state when user load fails', () => {
      const { INITIAL_STATE } = fromReducer;

      let state = fromReducer.userReducer(INITIAL_STATE, LoadUserProfile());
      state = fromReducer.userReducer(state, LoadUserProfileFailed());

      expect(state).toEqual(INITIAL_STATE);
    });
  });
});
