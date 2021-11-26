import { PERMISSIONS } from './user-constants';

export interface FeatureFlag {
  name: FEATURE_FLAGS_ENUM;
  active: boolean;
}

interface PermissionConfig {
  permission: PERMISSIONS;
  statusMapper: (isFlagActive: boolean) => boolean;
}

const defaultStatusMapper = (isFlagActive: boolean) => isFlagActive;
const invertedStatusMapper = (isFlagActive: boolean) => !isFlagActive;

export enum FEATURE_FLAGS_ENUM {
  DELIVERY = 'web_delivery',
  STRIPE = 'web_stripe',
  BUMPS = 'EnableVisibility',
  SUBSCRIPTIONS = 'EnablePros',
  HIDE_ADS = 'NoAds',
}

export const INIT_FEATURE_FLAGS = [FEATURE_FLAGS_ENUM.BUMPS, FEATURE_FLAGS_ENUM.SUBSCRIPTIONS, FEATURE_FLAGS_ENUM.HIDE_ADS];

export const featurePermissionConfig: Partial<Record<FEATURE_FLAGS_ENUM, PermissionConfig>> = {
  [FEATURE_FLAGS_ENUM.BUMPS]: {
    permission: PERMISSIONS.bumps,
    statusMapper: defaultStatusMapper,
  },
  [FEATURE_FLAGS_ENUM.SUBSCRIPTIONS]: {
    permission: PERMISSIONS.subscriptions,
    statusMapper: defaultStatusMapper,
  },
  [FEATURE_FLAGS_ENUM.HIDE_ADS]: {
    permission: PERMISSIONS.showAds,
    statusMapper: invertedStatusMapper,
  },
};
