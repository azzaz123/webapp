import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { BumpsPackageBalanceDTO } from '@api/visibility/dtos/bumps/bumps-package-balance.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';

export const MOCK_BUMPS_PACKAGE_BALANCE: BumpsPackageBalanceDTO[] = [
  {
    subscription_type: 'MOTORBIKES',
    category_ids: [14000],
    balance: [
      {
        type: 'zonebump',
        duration_days: 2,
        total: 5,
        used: 3,
      },
      {
        type: 'countrybump',
        duration_days: 2,
        total: 100,
        used: 90,
      },
    ],
  },
  {
    subscription_type: 'CONSUMERGOODS',
    category_ids: [13100, 12461, 17000, 16000, 18000, 15000, 19000, 12465, 12900, 12467, 12463, 12485, 12579, 12545, 13200, 20000, 21000],
    balance: [
      {
        type: 'zonebump',
        duration_days: 2,
        total: 9,
        used: 2,
      },
    ],
  },
];

export const MOCK_BUMPS_PACKAGE_BALANCE_MAPPED: BumpsPackageBalance[] = [
  {
    subscription_type: SUBSCRIPTION_CATEGORY_TYPES.MOTORBIKES,
    category_ids: [14000],
    balance: [
      {
        type: BUMP_TYPE.ZONE_BUMP,
        duration_days: 2,
        total: 5,
        used: 3,
      },
      {
        type: BUMP_TYPE.COUNTRY_BUMP,
        duration_days: 2,
        total: 100,
        used: 90,
      },
    ],
  },
  {
    subscription_type: SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS,
    category_ids: [13100, 12461, 17000, 16000, 18000, 15000, 19000, 12465, 12900, 12467, 12463, 12485, 12579, 12545, 13200, 20000, 21000],
    balance: [
      {
        type: BUMP_TYPE.ZONE_BUMP,
        duration_days: 2,
        total: 9,
        used: 2,
      },
    ],
  },
];
