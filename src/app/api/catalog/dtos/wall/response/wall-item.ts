import { CatalogItemAttribute, CatalogItemImage, CatalogItemPrice } from '@api/catalog/dtos';

export interface WallItem {
  id: string;
  type: 'consumer_goods' | 'real_estate' | 'cars';
  title: string;
  description: string;
  slug: string;
  distance: number;
  images: CatalogItemImage[];
  price: CatalogItemPrice;
  attributes: CatalogItemAttribute[];
  bump?: { type: string };
  reserved?: { flag: boolean };
  pro?: { flag: boolean };
}
