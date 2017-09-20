import { Item } from 'shield';

export interface ItemChangeEvent {
  item: Item;
  action: string;
}
