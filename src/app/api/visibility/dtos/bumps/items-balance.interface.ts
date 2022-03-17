export interface ItemsBalanceDTO {
  balance_check: ItemBalanceDTO[];
}

interface ItemBalanceDTO {
  item_id: string;
  has_balance: boolean;
}
