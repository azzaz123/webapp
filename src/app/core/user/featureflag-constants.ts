import { PERMISSIONS } from './user-constants';

export interface FeatureFlag {
  name: FEATURE_FLAGS_ENUM;
  active: boolean;
}

export enum FEATURE_FLAGS_ENUM {
  DELIVERY = 'web_delivery',
  STRIPE = 'web_stripe',
  BUMPS = 'EnableVisibility',
  SUBSCRIPTIONS = 'EnablePros',
  SHIPPING_TOGGLE = 'ShippingToggleUpload',
}

export const INIT_FEATURE_FLAGS = [FEATURE_FLAGS_ENUM.BUMPS, FEATURE_FLAGS_ENUM.SUBSCRIPTIONS, FEATURE_FLAGS_ENUM.SHIPPING_TOGGLE];

export const featurePermissionConfig: Partial<Record<FEATURE_FLAGS_ENUM, PERMISSIONS>> = {
  [FEATURE_FLAGS_ENUM.BUMPS]: PERMISSIONS.bumps,
  [FEATURE_FLAGS_ENUM.SUBSCRIPTIONS]: PERMISSIONS.subscriptions,
};
