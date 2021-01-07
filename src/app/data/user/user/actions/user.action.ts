import { API_ACTION, PAGE_ACTION } from '@core/store';
import { createAction, props } from '@ngrx/store';
import { User } from '../domain/user';

const KEY_STATE = '[User]';

export const LoadUserProfile = createAction(
  `${KEY_STATE} ${PAGE_ACTION} Load User Profile`
);

export const LoadUserProfileSuccess = createAction(
  `${KEY_STATE} ${API_ACTION} Load User Profile Success`,
  props<{ user: User }>()
);

export const LoadUserProfileFailed = createAction(
  `${KEY_STATE} ${API_ACTION} Load User Profile Failed`
);
