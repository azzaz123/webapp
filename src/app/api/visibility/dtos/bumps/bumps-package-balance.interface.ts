export interface BumpsPackageBalanceResponse {
  user_balance: BumpsPackageBalanceDTO[];
}
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
  extra: number;
}
