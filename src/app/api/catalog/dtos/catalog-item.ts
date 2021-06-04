import { CatalogItemImage } from './catalog-item-image';
import { CatalogItemPrice } from './catalog-item-price';
import { CatalogItemAttribute } from './catalog-item-attribute';

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  images: CatalogItemImage[];
  price: CatalogItemPrice;
  attributes: CatalogItemAttribute[];
  slug: string;
}
