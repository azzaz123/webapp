import { Order, Product } from '@core/item/item-response.interface';

export interface SelectedProduct {
  itemId: string;
  product: Product;
}

export interface OrderEvent {
  order: Order[];
  total: number;
}

export enum STATUS {
  SOLD = 'sold',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SELECTED = 'selected',
  ONHOLD = 'onhold',
}
