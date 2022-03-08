import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '@core/item/item';
import { Duration, Product } from '@core/item/item-response.interface';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';

export interface ItemWithProducts {
  item: Item;
  products: ProductMapped[];
  subscription: SubscriptionsResponse;
  isProvincialBump: boolean;
}

export interface ItemsBySubscription {
  items: ItemWithProducts[];
  subscription: SubscriptionsResponse;
  availableFreeBumps: number;
}

export interface ProductMapped extends Product {
  durations: DurationMapped[];
}

export interface DurationMapped extends Duration {
  isFreeOption?: boolean;
  subscriptionPackageType?: SUBSCRIPTION_CATEGORY_TYPES;
  subscriptionName?: string;
}

export interface SelectedProduct {
  item: Item;
  productType: string;
  duration: DurationMapped;
  isFree: boolean;
  isProvincialBump: boolean;
}

export interface BumpRequestSubject {
  service?: BUMP_SERVICE_TYPE;
  hasError?: boolean;
  error?: unknown | HttpErrorResponse;
  errorCode?: number;
}

export enum BUMP_SERVICE_TYPE {
  STRIPE = 'stripe',
  SUBSCRIPTION_BUMPS = 'subscriptionBumps',
}
