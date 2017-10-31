import { Order, Product } from '../../../core/item/item-response.interface';

export interface SelectedProduct {
  itemId: string;
  product: Product;
}

export interface OrderEvent {
  order: Order[];
  total: number;
}
