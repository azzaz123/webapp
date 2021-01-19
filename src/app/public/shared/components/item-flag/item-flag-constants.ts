export enum ITEM_FLAG_TYPES {
  DEFAULT = 'text',
  SOLD = 'sold',
  RESERVED = 'reserved',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
  FEATURED = 'featured',
}

export interface FlagProperties {
  id: string;
  label: string;
  itemType: ITEM_FLAG_TYPES;
}

export const LEFT_FLAGS: FlagProperties[] = [
  {
    id: 'sold',
    label: $localize`:@@Sold:Sold`,
    itemType: ITEM_FLAG_TYPES.SOLD,
  },
  {
    id: 'reserved',
    label: $localize`:@@Reserved:Reserved`,
    itemType: ITEM_FLAG_TYPES.RESERVED,
  },
  {
    id: 'expired',
    label: $localize`:@@Expired:Expired`,
    itemType: ITEM_FLAG_TYPES.EXPIRED,
  },
  {
    id: 'onhold',
    label: $localize`:@@Inactive:Inactive`,
    itemType: ITEM_FLAG_TYPES.INACTIVE,
  },
];

export const BUMP_FLAG: FlagProperties = {
  id: 'featured',
  label: $localize`:@@Featured:Featured`,
  itemType: ITEM_FLAG_TYPES.FEATURED,
};

export const FLAGS: FlagProperties[] = [...LEFT_FLAGS, BUMP_FLAG];
