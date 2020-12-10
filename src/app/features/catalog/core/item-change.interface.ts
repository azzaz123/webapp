import { OrderEvent } from '../components/selected-items/selected-product.interface';
import { Item } from '@core/item/item';

export interface ItemChangeEvent {
  item?: Item;
  action: string;
  orderEvent?: OrderEvent;
}
