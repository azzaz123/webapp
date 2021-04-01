import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';

export interface ItemCardCore {
  id: string;
  title: string;
  description?: string;
  salePrice: number;
  currencyCode: string;
  ownerId: string;
  webSlug: string;
  flags?: ItemFlags;
  bumpFlags?: ItemVisibilityFlags;
}
