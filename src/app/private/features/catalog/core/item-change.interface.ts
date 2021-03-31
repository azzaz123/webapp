import { OrderEvent } from '../components/selected-items/selected-product.interface';
import { Item } from '@core/item/item';

export interface ItemChangeEvent {
  item?: Item;
  action: ITEM_CHANGE_ACTION | string;
  orderEvent?: OrderEvent;
}

export enum ITEM_CHANGE_ACTION {
  REACTIVATED = 'reactivated',
}
