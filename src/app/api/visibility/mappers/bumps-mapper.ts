import { BumpPackageBalance, BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { BumpsPackageBalanceDTO } from '../dtos/bumps/bumps-package-balance.interface';

export function mapBalance(bumps: BumpsPackageBalanceDTO[]): BumpsPackageBalance[] {
  return bumps.map(mapBump);
}

function mapBump(bump: BumpsPackageBalanceDTO): BumpsPackageBalance {
  const bumpMapped: BumpsPackageBalance = {
    ...bump,
    subscription_type: bump.subscription_type as SUBSCRIPTION_CATEGORY_TYPES,
    balance: bump.balance as BumpPackageBalance[],
  };

  return bumpMapped;
}
