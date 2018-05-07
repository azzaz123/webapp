import { Item } from '../item/item';

export interface VisibilityFlags {
  bumped: boolean;
  highlighted: boolean;
  urgent: boolean;
}

export interface Purchase {
  item_id: string;
  expiration_date: number;
  boost?: boolean;
  highlight?: boolean;
  autorenew: boolean;
  item?: Item;
  bump: boolean;
  national: boolean;
  visibility_flags: VisibilityFlags;
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
  boost?: boolean;
  highlight?: boolean;
  autorenew: boolean;
  bump: boolean;
  national: boolean;
}

export interface StatusResponse {
  autorenew_alert: number;
  active: boolean;
}