import { Item } from '@core/item/item';
import { Duration, Product } from '@core/item/item-response.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';

export interface ItemWithProducts {
  item: Item;
  products: ProductMapped[];
  isProvincialBump: boolean;
}

export interface ProductMapped extends Product {
  durations: DurationMapped[];
}

export interface DurationMapped extends Duration {
  isFreeOption?: boolean;
  subscriptionPackageType?: SUBSCRIPTION_CATEGORY_TYPES;
}
