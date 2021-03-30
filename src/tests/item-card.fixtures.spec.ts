import { ItemCard } from '@public/shared/components/item-card/interfaces/item-card.interface';
import { ITEM_BUMP_FLAGS, ITEM_DATA } from './item.fixtures.spec';

export const MOCK_ITEM_CARD: ItemCard = {
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
  flags: ITEM_DATA.flags,
  bumpFlags: ITEM_BUMP_FLAGS,
};
