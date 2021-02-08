import { COLORS } from '@core/colors/colors-constants';
import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';

export const EMPTY_ITEM_FLAGS: ItemFlags = {
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

export const EMPTY_ITEM_VISIBILITY_FLAGS: ItemVisibilityFlags = {
  bumped: false,
  highlighted: false,
  urgent: false,
  country_bumped: false,
  boosted: false,
};

export enum STATUS_ITEM_FLAG_TYPES {
  DEFAULT = 'default',
  SOLD = 'sold',
  RESERVED = 'reserved',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
}

export enum BUMPED_ITEM_FLAG_TYPES {
  BUMPED = 'bumped',
  COUNTRY_BUMP = 'country_bumped',
}

export enum ITEM_FLAG_ICONS {
  DEFAULT = '/assets/icons/item-flags/default.svg',
  SOLD = '/assets/icons/item-flags/sold.svg',
  RESERVED = '/assets/icons/item-flags/reserved.svg',
  EXPIRED = '/assets/icons/item-flags/expired.svg',
  INACTIVE = '/assets/icons/item-flags/clock.svg',
  BUMPED = '/assets/icons/item-flags/featured.svg',
  COUNTRY_BUMP = '/assets/icons/item-flags/featured.svg',
}

export interface FlagProperties {
  id: string;
  label?: string;
  itemType: STATUS_ITEM_FLAG_TYPES | BUMPED_ITEM_FLAG_TYPES;
  icon: ITEM_FLAG_ICONS;
  fill?: string;
}

export const STATUS_FLAGS: FlagProperties[] = [
  {
    id: 'sold',
    label: $localize`:@@Sold:Sold`,
    itemType: STATUS_ITEM_FLAG_TYPES.SOLD,
    icon: ITEM_FLAG_ICONS.SOLD,
    fill: COLORS.NEGATIVE_MAIN,
  },
  {
    id: 'reserved',
    label: $localize`:@@Reserved:Reserved`,
    itemType: STATUS_ITEM_FLAG_TYPES.RESERVED,
    icon: ITEM_FLAG_ICONS.RESERVED,
    fill: COLORS.SKYBLUE_DARK,
  },
  {
    id: 'expired',
    label: $localize`:@@Expired:Expired`,
    itemType: STATUS_ITEM_FLAG_TYPES.EXPIRED,
    icon: ITEM_FLAG_ICONS.EXPIRED,
    fill: COLORS.SOFTBLUE_MAIN,
  },
  {
    id: 'onhold',
    label: $localize`:@@Inactive:Inactive`,
    itemType: STATUS_ITEM_FLAG_TYPES.INACTIVE,
    icon: ITEM_FLAG_ICONS.INACTIVE,
    fill: COLORS.MAGENTA_MAIN,
  },
];

export const BUMP_FLAGS: FlagProperties[] = [
  {
    id: 'bumped',
    label: $localize`:@@Featured:Featured`,
    itemType: BUMPED_ITEM_FLAG_TYPES.BUMPED,
    icon: ITEM_FLAG_ICONS.BUMPED,
  },
  {
    id: 'country_bumped',
    label: $localize`:@@Featured:Featured`,
    itemType: BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP,
    icon: ITEM_FLAG_ICONS.COUNTRY_BUMP,
  },
];

export const DEFAULT_FLAG: FlagProperties = {
  id: 'default',
  itemType: STATUS_ITEM_FLAG_TYPES.DEFAULT,
  icon: ITEM_FLAG_ICONS.DEFAULT,
};

export const FLAGS: FlagProperties[] = [...STATUS_FLAGS, ...BUMP_FLAGS, DEFAULT_FLAG];
