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
  translation: string;
  itemType: ITEM_FLAG_TYPES;
}

export const LEFT_FLAGS: FlagProperties[] = [
  {
    id: 'sold',
    translation: $localize`:@@Sold:Sold`,
    itemType: ITEM_FLAG_TYPES.SOLD,
  },
  {
    id: 'reserved',
    translation: $localize`:@@Reserved:Reserved`,
    itemType: ITEM_FLAG_TYPES.RESERVED,
  },
  {
    id: 'expired',
    translation: $localize`:@@Expired:Expired`,
    itemType: ITEM_FLAG_TYPES.EXPIRED,
  },
  {
    id: 'onhold',
    translation: $localize`:@@Inactive:Inactive`,
    itemType: ITEM_FLAG_TYPES.INACTIVE,
  },
];
