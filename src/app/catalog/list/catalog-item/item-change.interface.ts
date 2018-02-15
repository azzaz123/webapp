import { Item } from 'shield';
import { OrderEvent } from '../selected-items/selected-product.interface';

export interface ItemChangeEvent {
  item?: Item;
  action: string;
  orderEvent?: OrderEvent
}
