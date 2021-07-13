import { CatalogItemAttribute, CatalogItemImage, CatalogItemPrice } from '@api/catalog/dtos';
import { ItemType } from '@api/core/model/item';

export interface WallItem {
  id: string;
  type: ItemType;
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
