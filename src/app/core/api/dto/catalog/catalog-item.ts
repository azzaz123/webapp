import { CatalogItemImage } from '@core/api/dto/catalog/catalog-item-image';
import { CatalogItemPrice } from '@core/api/dto/catalog/catalog-item-price';
import { CatalogItemAttribute } from '@core/api/dto/catalog/catalog-item-attribute';

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  images: CatalogItemImage[];
  price: CatalogItemPrice;
  attributes: CatalogItemAttribute[];
}
