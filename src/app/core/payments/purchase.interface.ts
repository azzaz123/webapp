import { Item } from '../item/item';

export interface VisibilityFlags {
  bumped: boolean;
  highlighted: boolean;
  urgent: boolean;
}

export interface Purchase {
  item_id: string;
  expiration_date: number;
  autorenew: boolean;
  bump: boolean;
  national: boolean;
  visibility_flags: VisibilityFlags;
  highlight?: boolean;
  item?: Item;
  boost?: boolean;
}

export interface Purchases {
  bumpItems: Purchase[];
  nationalBumpItems: Purchase[];
}

export interface AutorenewItem {
  item_id: string;
  autorenew: boolean;
}

export interface PurchasingItem {
  item_id: string;
  autorenew: boolean;
  bump: boolean;
  national: boolean;
  boost?: boolean;
  highlight?: boolean;
}

export interface StatusResponse {
  autorenew_alert: number;
  active: boolean;
}
