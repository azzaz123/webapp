import { PERMISSIONS } from './user-constants';

export interface FeatureFlag {
  name: FEATURE_FLAGS_ENUM;
  isActive: boolean;
}

export enum FEATURE_FLAGS_ENUM {
  DELIVERY = 'web_delivery',
  STRIPE = 'web_stripe',
  VISIBILITY = 'EnableVisibility',
}

export const ACTIVE_DEV_FEATURE_FLAGS: FEATURE_FLAGS_ENUM[] = [];

export const featurePermissionConfig: Partial<Record<FEATURE_FLAGS_ENUM, PERMISSIONS>> = {
  [FEATURE_FLAGS_ENUM.VISIBILITY]: PERMISSIONS.visibility,
};
