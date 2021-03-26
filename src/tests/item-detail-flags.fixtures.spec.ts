import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';

export const MOCK_ITEM_FLAGS: ItemFlags = {
  pending: false,
  sold: false,
  favorite: false,
  reserved: false,
  removed: false,
  banned: false,
  expired: false,
  review_done: false,
  bumped: false,
  highlighted: false,
};

export const MOCK_ITEM_FLAGS_RESERVED: ItemFlags = {
  ...MOCK_ITEM_FLAGS,
  reserved: true,
};

export const MOCK_ITEM_FLAGS_SOLD: ItemFlags = {
  ...MOCK_ITEM_FLAGS,
  sold: true,
};

export const MOCK_ITEM_FLAGS_EXPIRED: ItemFlags = {
  ...MOCK_ITEM_FLAGS,
  expired: true,
};

export const MOCK_ITEM_FLAGS_INACTIVE: ItemFlags = {
  ...MOCK_ITEM_FLAGS,
  onhold: true,
};

export const MOCK_ITEM_VISIBILITY_FLAGS: ItemVisibilityFlags = {
  bumped: false,
  highlighted: false,
  urgent: false,
  country_bumped: false,
  boosted: false,
};

export const MOCK_ITEM_VISIBILITY_FLAGS_BUMPED: ItemVisibilityFlags = {
  ...MOCK_ITEM_VISIBILITY_FLAGS,
  bumped: true,
};

export const MOCK_ITEM_VISIBILITY_FLAGS_COUNTRY_BUMPED: ItemVisibilityFlags = {
  ...MOCK_ITEM_VISIBILITY_FLAGS,
  country_bumped: true,
};
