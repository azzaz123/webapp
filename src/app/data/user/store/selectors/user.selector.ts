import { createFeatureSelector } from '@ngrx/store';
import { KEY_FEATURE_STATE, UserState } from '../reducer';

export const selectUserFeature = createFeatureSelector<UserState>(KEY_FEATURE_STATE);
