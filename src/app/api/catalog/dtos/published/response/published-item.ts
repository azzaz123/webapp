import { CatalogItemAttribute, CatalogItemImage, CatalogItemPrice } from '@api/catalog/dtos';

export interface PublishedItem {
  id: string;
  category_id: string;
  title: string;
  description: string;
  images: CatalogItemImage[];
  price: CatalogItemPrice;
  attributes: CatalogItemAttribute[];
  slug: string;
  reserved?: { flag: boolean };
  bump?: { type: string };
}
