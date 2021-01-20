import { COLORS } from '@core/colors/colors-constants';

export enum ITEM_FLAG_TYPES {
  DEFAULT = 'default',
  SOLD = 'sold',
  RESERVED = 'reserved',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
  FEATURED = 'featured',
}

export enum ITEM_FLAG_ICONS {
  DEFAULT = '/assets/icons/item-flags/default.svg',
  SOLD = '/assets/icons/item-flags/sold.svg',
  RESERVED = '/assets/icons/item-flags/reserved.svg',
  EXPIRED = '/assets/icons/item-flags/expired.svg',
  INACTIVE = '/assets/icons/item-flags/clock.svg',
  FEATURED = '/assets/icons/item-flags/featured.svg',
}

export interface FlagProperties {
  id: string;
  label?: string;
  itemType: ITEM_FLAG_TYPES;
  icon: ITEM_FLAG_ICONS;
  fill?: string;
}

export const LEFT_FLAGS: FlagProperties[] = [
  {
    id: 'sold',
    label: $localize`:@@Sold:Sold`,
    itemType: ITEM_FLAG_TYPES.SOLD,
    icon: ITEM_FLAG_ICONS.SOLD,
    fill: COLORS.NEGATIVE_MAIN,
  },
  {
    id: 'reserved',
    label: $localize`:@@Reserved:Reserved`,
    itemType: ITEM_FLAG_TYPES.RESERVED,
    icon: ITEM_FLAG_ICONS.RESERVED,
    fill: COLORS.SKYBLUE_DARK,
  },
  {
    id: 'expired',
    label: $localize`:@@Expired:Expired`,
    itemType: ITEM_FLAG_TYPES.EXPIRED,
    icon: ITEM_FLAG_ICONS.EXPIRED,
    fill: COLORS.SOFTBLUE_MAIN,
  },
  {
    id: 'onhold',
    label: $localize`:@@Inactive:Inactive`,
    itemType: ITEM_FLAG_TYPES.INACTIVE,
    icon: ITEM_FLAG_ICONS.INACTIVE,
    fill: COLORS.MAGENTA_MAIN,
  },
];

export const BUMP_FLAG: FlagProperties = {
  id: 'featured',
  label: $localize`:@@Featured:Featured`,
  itemType: ITEM_FLAG_TYPES.FEATURED,
  icon: ITEM_FLAG_ICONS.FEATURED,
};

export const DEFAULT_FLAG: FlagProperties = {
  id: 'default',
  itemType: ITEM_FLAG_TYPES.DEFAULT,
  icon: ITEM_FLAG_ICONS.DEFAULT,
};

export const FLAGS: FlagProperties[] = [...LEFT_FLAGS, BUMP_FLAG, DEFAULT_FLAG];
