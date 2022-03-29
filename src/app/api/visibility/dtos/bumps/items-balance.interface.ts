export interface ItemsBalanceDTO {
  balance_check: ItemBalanceDTO[];
}

export interface ItemBalanceDTO {
  item_id: string;
  has_balance: boolean;
}
