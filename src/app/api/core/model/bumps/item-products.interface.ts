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
}

export interface ProductMapped extends Product {
  durations: DurationMapped[];
}

export interface DurationMapped extends Duration {
  isFreeOption?: boolean;
  subscriptionPackageType?: SUBSCRIPTION_CATEGORY_TYPES;
}
