import {
  LoadUserProfile,
  LoadUserProfileFailed,
  LoadUserProfileSuccess,
} from 'app/data/user/actions/user.action';
import { Profile } from 'app/data/user/domain';
import * as fromReducer from 'app/data/user/store/reducer/profile.reducer';
import { ProfileMother } from '../../domain/profile/profile.mother';

describe('Profile Reducer', () => {
  describe('Initial state', () => {
    it('should return an default value', () => {
      const { INITIAL_USER_PROFILE_STATE } = fromReducer;

      const action = {
        type: 'Unkown',
      };

      const state = fromReducer.userProfileReducer(
        INITIAL_USER_PROFILE_STATE,
        action
      );

      expect(state).toEqual(INITIAL_USER_PROFILE_STATE);
    });
  });

  describe('Load User Profile', () => {
    it('should set loading true when load user profile', () => {
      const { INITIAL_USER_PROFILE_STATE } = fromReducer;

      const state = fromReducer.userProfileReducer(
        INITIAL_USER_PROFILE_STATE,
        LoadUserProfile()
      );

      expect(state).toEqual({ ...INITIAL_USER_PROFILE_STATE, loading: true });
    });

    it('should set user and authenticated when user is loaded successfully', () => {
      const { INITIAL_USER_PROFILE_STATE } = fromReducer;
      const userDetail: Profile = ProfileMother.random();

      let state = fromReducer.userProfileReducer(
        INITIAL_USER_PROFILE_STATE,
        LoadUserProfile()
      );
      state = fromReducer.userProfileReducer(
        state,
        LoadUserProfileSuccess({ user: userDetail })
      );

      expect(state).toEqual({
        userDetail,
        loading: false,
      });
    });

    it('should set initial state when user load fails', () => {
      const { INITIAL_USER_PROFILE_STATE } = fromReducer;

      let state = fromReducer.userProfileReducer(
        INITIAL_USER_PROFILE_STATE,
        LoadUserProfile()
      );
      state = fromReducer.userProfileReducer(state, LoadUserProfileFailed());

      expect(state).toEqual(INITIAL_USER_PROFILE_STATE);
    });
  });
});
