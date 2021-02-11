import { API_ACTION, PAGE_ACTION } from '@core/store';
import { createAction, props } from '@ngrx/store';
import { Profile } from '../domain';

const KEY_STATE = '[User]';

export const LoadUserProfile = createAction(`${KEY_STATE} ${PAGE_ACTION} Load User Profile`);

export const LoadUserProfileSuccess = createAction(`${KEY_STATE} ${API_ACTION} Load User Profile Success`, props<{ user: Profile }>());

export const LoadUserProfileFailed = createAction(`${KEY_STATE} ${API_ACTION} Load User Profile Failed`);

export const SendUpdateEmail = createAction(`${KEY_STATE} ${PAGE_ACTION} Send Update Email`, props<{ emailAddress: string }>());

export const SendUpdateEmailSuccess = createAction(`${KEY_STATE} ${API_ACTION} Send Update Email Success`);

export const SendUpdateEmailFailed = createAction(`${KEY_STATE} ${API_ACTION} Send Update Email Failed`);

export const SendUpdatePassword = createAction(
  `${KEY_STATE} ${PAGE_ACTION} Send Update Password`,
  props<{ old_password: string; new_password: string }>()
);

export const SendUpdatePasswordSuccess = createAction(`${KEY_STATE} ${API_ACTION} Send Update Password Success`);

export const SendUpdatePasswordFailed = createAction(`${KEY_STATE} ${API_ACTION} Send Update Password Failed`);
