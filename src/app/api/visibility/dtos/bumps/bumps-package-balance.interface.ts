export interface BumpsPackageBalanceDTO {
  subscription_type: string;
  category_ids: number[];
  balance: BumpPackageBalanceDTO[];
}

interface BumpPackageBalanceDTO {
  type: string;
  duration_days: number;
  total: number;
  used: number;
}
