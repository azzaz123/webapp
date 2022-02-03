import { Item } from '@core/item/item';
import { Product } from '@core/item/item-response.interface';

export interface ItemWithProducts {
  item: Item;
  products: Product[];
}
