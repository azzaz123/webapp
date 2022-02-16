import { Observable, of } from 'rxjs';

import {
  SubscriptionResponse,
  SubscriptionsResponse,
  Tier,
  SUBSCRIPTION_MARKETS,
  TierDiscount,
  SUBSCRIPTION_CATEGORY_TYPES,
  PERK_NAMES,
  BUMP_NAMES,
} from '../app/core/subscriptions/subscriptions.interface';
import { SUBSCRIPTION_TYPES } from '../app/core/subscriptions/subscriptions.service';
import { SubscriptionBenefit } from '@core/subscriptions/subscription-benefits/interfaces/subscription-benefit.interface';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { SubscriptionsV3Response, TierDto } from '@core/subscriptions/dtos/subscriptions/subscription-response.interface';

export class MockSubscriptionService {
  getSubscriptions() {
    return of(SUBSCRIPTIONS);
  }

  public getUserSubscriptionType() {
    return of(SUBSCRIPTION_TYPES.stripe);
  }

  public getSubscriptionBenefits() {
    return of(MOCK_SUBSCRIPTION_BENEFITS);
  }

  public isStripeSubscription(subscription: SubscriptionsResponse): boolean {
    if (!subscription.market) {
      return false;
    }
    return subscription.market === SUBSCRIPTION_MARKETS.STRIPE;
  }

  public hasOneStripeSubscription(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some((subscription) => this.isStripeSubscription(subscription));
  }

  public hasTrial(subscription: SubscriptionsResponse): boolean {
    return subscription.trial_available;
  }

  public hasOneTrialSubscription(_subscriptions: SubscriptionsResponse[]): boolean {
    return false;
  }

  public getDefaultTierSubscriptionDiscount(_subscriptions: SubscriptionsResponse[]) {}

  public getSubscriptionByCategory(_subscriptions: SubscriptionsResponse[]) {}

  public tierDiscountByCategoryId(_subscriptions: SubscriptionsResponse[], id: string) {}

  public getTrialSubscriptionsIds(subscriptions: SubscriptionsResponse[]): number[] {
    if (!subscriptions) {
      return [];
    }
    return subscriptions.filter((subscription) => this.hasTrial(subscription)).map((subscription) => subscription.category_id);
  }

  public newSubscription(): Observable<any> {
    return of({});
  }

  public checkNewSubscriptionStatus(): Observable<SubscriptionResponse> {
    return of(SUBSCRIPTION_SUCCESS);
  }

  public hasFreeTrialByCategoryId(): boolean {
    return true;
  }

  public hasHighestLimit(): boolean {
    return false;
  }

  public getDefaultTierDiscount(): TierDiscount {
    return null;
  }

  public hasSomeSubscriptionDiscount(): boolean {
    return false;
  }

  public editSubscription(): Observable<unknown> {
    return of({ status: 202 });
  }
  public cancelSubscription(): Observable<unknown> {
    return of({ status: 202 });
  }
  public continueSubscription(): Observable<unknown> {
    return of({ status: 202 });
  }
}

export const MOCK_SUBSCRIPTION_BENEFITS: SubscriptionBenefit[] = [
  {
    iconPath: 'empty-image',
    title: 'Professionalize your profile',
    description: 'Stand out above the rest with a cover photo and a description of what you offer',
  },
  {
    iconPath: 'empty-image',
    title: 'Connect with more clients',
    description: 'Share with millions of potential buyers your phone and website',
  },
  {
    iconPath: 'empty-image',
    title: 'Without time limit',
    description: 'Your items will never expire, they will be always ready for a quick sell',
  },
  {
    iconPath: 'empty-image',
    title: 'Without compromise',
    description: 'You can cancel your subscription whenever you want, without penalties',
  },
];

export const TIER_DISCOUNT: TierDiscount = {
  end_date: 1640908800000,
  percentage: 50,
  price: 9.5,
  no_discount_date: 1640908800000,
};

export const TIER_WITH_DISCOUNT_NO_MAPPED: TierDto = {
  id: 'plan_FWuFVeTHEDyECd',
  limit: 9,
  price: 9.99,
  currency: '€',
  discount: TIER_DISCOUNT,
  is_basic: false,
  perks: [
    {
      name: PERK_NAMES.LIMIT,
      quantity: 9,
    },
  ],
};

export const TIER_WITH_DISCOUNT: Tier = {
  ...TIER_WITH_DISCOUNT_NO_MAPPED,
  bumps: [],
};

export const TIER_2_WITH_DISCOUNT: Tier = {
  ...TIER_WITH_DISCOUNT,
  id: 'plan_FWuFVeTHEDyECz',
  limit: 50,
  perks: [
    {
      name: PERK_NAMES.LIMIT,
      quantity: 50,
    },
  ],
};

export const MOCK_TIER_2_WITH_DISCOUNT_WITH_ZONE_BUMP: Tier = {
  ...TIER_WITH_DISCOUNT,
  id: 'plan_FWuFVeTHEDyECz',
  limit: 50,
  perks: [
    {
      name: PERK_NAMES.LIMIT,
      quantity: 50,
    },
    {
      name: BUMP_NAMES.ZONEBUMP,
      quantity: 50,
      used: 2,
      duration_days: 2,
    },
  ],
  bumps: [
    {
      name: BUMP_NAMES.ZONEBUMP,
      quantity: 50,
      used: 2,
      duration_days: 2,
    },
  ],
};

export const TIER_WITH_DISCOUNT_WITHOUT_LIMIT: Tier = {
  ...TIER_WITH_DISCOUNT,
  id: 'plan_FWuFVeTHEDyECe',
  limit: undefined,
  perks: [],
};

export const TIER_WITH_DISCOUNT_WITHOUT_LIMIT_NO_MAPPED: TierDto = {
  ...TIER_WITH_DISCOUNT_NO_MAPPED,
  id: 'plan_FWuFVeTHEDyECe',
  limit: undefined,
  perks: [],
};

export const TIER_BASIC_WITH_DISCOUNT: Tier = {
  id: 'plan_FWuFVeTHEDyECa',
  limit: 9,
  price: 9.99,
  currency: '€',
  discount: TIER_DISCOUNT,
  is_basic: true,
  perks: [
    {
      name: PERK_NAMES.LIMIT,
      quantity: 9,
    },
  ],
  bumps: [],
};

export const TIER_NO_DISCOUNT_NO_BASIC: Tier = {
  id: 'plan_FWuFVeTHEDyECb',
  limit: 9,
  price: 9.99,
  currency: '€',
  discount: null,
  is_basic: false,
  perks: [
    {
      name: PERK_NAMES.LIMIT,
      quantity: 9,
    },
  ],
  bumps: [],
};

export const TIER_NO_DISCOUNT_NO_BASIC_NO_LIMIT: Tier = {
  id: 'plan_FWuFVeTHEDyECc',
  price: 9.99,
  currency: '€',
  discount: null,
  is_basic: false,
  limit: undefined,
  perks: [],
  bumps: [],
};

const MOCK_CG_BASIC_DATA: Partial<SubscriptionsResponse> = {
  category_ids: [CATEGORY_IDS.HOME_GARDEN, CATEGORY_IDS.SPORTS_LEISURE],
  type: SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS,
};

const MOCK_RE_BASIC_DATA: Partial<SubscriptionsResponse> = {
  category_ids: [CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE],
  type: SUBSCRIPTION_CATEGORY_TYPES.REAL_ESTATE,
};

const MOCK_CARS_BASIC_DATA: Partial<SubscriptionsResponse> = {
  category_ids: [CATEGORY_SUBSCRIPTIONS_IDS.CAR],
  type: SUBSCRIPTION_CATEGORY_TYPES.CARS,
};

const MOCK_MOTORBIKE_BASIC_DATA: Partial<SubscriptionsResponse> = {
  category_ids: [CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE],
  type: SUBSCRIPTION_CATEGORY_TYPES.MOTORBIKES,
};

const MOCK_CG_BASIC_DATA_MAPPED: Partial<SubscriptionsResponse> = {
  ...MOCK_CG_BASIC_DATA,
  category_id: CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS,
  category_icon: 'All',
  category_name: 'Everything else',
};

const MOCK_RE_BASIC_DATA_MAPPED: Partial<SubscriptionsResponse> = {
  ...MOCK_RE_BASIC_DATA,
  category_id: CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE,
  category_icon: 'house',
  category_name: 'Real Estate',
};

const MOCK_CARS_BASIC_DATA_MAPPED: Partial<SubscriptionsResponse> = {
  ...MOCK_CARS_BASIC_DATA,
  category_id: CATEGORY_SUBSCRIPTIONS_IDS.CAR,
  category_icon: 'car',
  category_name: 'Cars',
};

const MOCK_MOTORBIKE_BASIC_DATA_MAPPED: Partial<SubscriptionsResponse> = {
  ...MOCK_MOTORBIKE_BASIC_DATA,
  category_id: CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE,
  category_icon: 'motorbike',
  category_name: 'Motorbike',
};

const MOCK_NO_SUBSCRIBED_DATA: Partial<SubscriptionsResponse> = {
  subscribed_from: null,
};

const MOCK_SUBSCRIBED_DATA: Partial<SubscriptionsResponse> = {
  id: 'abcd-1234-efgh-5678',
  subscribed_from: 1567675698,
};

const MOCK_SUBSCRIBED_DATA_WITH_CANCELATION: Partial<SubscriptionsResponse> = {
  id: 'abcd-1234-efgh-5678',
  subscribed_from: 1567675690,
  subscribed_until: 1567675699,
};

const DEFAULT_SUBSCRIPTION: SubscriptionsResponse = {
  selected_tier_id: null,
  default_tier_id: null,
  trial_available: false,
  category_id: null,
  category_ids: [],
  type: null,
  trial_days: 0,
  tiers: [],
};

function generateSubscription(
  subscriptionData: Partial<SubscriptionsResponse>,
  subscribedData: Partial<SubscriptionsResponse>,
  tiers: Tier[],
  market?: SUBSCRIPTION_MARKETS,
  freeTrial = false
): SubscriptionsResponse {
  let subscribedInfo: Partial<SubscriptionsResponse>;
  let trialInfo: Partial<SubscriptionsResponse>;

  if (subscribedData.subscribed_from)
    subscribedInfo = {
      selected_tier_id: tiers[0].id,
      selected_tier: tiers[0],
      market: market ? market : SUBSCRIPTION_MARKETS.STRIPE,
    };

  if (freeTrial) {
    trialInfo = {
      trial_available: true,
      trial_days: 30,
    };
  }

  return {
    ...DEFAULT_SUBSCRIPTION,
    ...subscriptionData,
    ...subscribedData,
    tiers,
    default_tier_id: tiers[0].id,
    ...subscribedInfo,
    ...trialInfo,
  };
}

export const MOCK_SUBSCRIPTION_RE_SUBSCRIBED: SubscriptionsResponse = generateSubscription(MOCK_RE_BASIC_DATA, MOCK_SUBSCRIBED_DATA, [
  TIER_WITH_DISCOUNT,
  TIER_WITH_DISCOUNT_WITHOUT_LIMIT,
]);

export const MOCK_SUBSCRIPTION_RE_SUBSCRIBED_NO_MAPPED: SubscriptionsV3Response = generateSubscription(
  MOCK_RE_BASIC_DATA,
  MOCK_SUBSCRIBED_DATA,
  [TIER_WITH_DISCOUNT_NO_MAPPED as Tier, TIER_WITH_DISCOUNT_WITHOUT_LIMIT_NO_MAPPED as Tier]
);

export const MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED: SubscriptionsResponse = generateSubscription(
  MOCK_CARS_BASIC_DATA,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_WITH_DISCOUNT, TIER_WITH_DISCOUNT_WITHOUT_LIMIT]
);

export const MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_NO_DISCOUNTS: SubscriptionsResponse = generateSubscription(
  MOCK_CARS_BASIC_DATA,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_NO_DISCOUNT_NO_BASIC, TIER_NO_DISCOUNT_NO_BASIC_NO_LIMIT]
);

export const MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED: SubscriptionsResponse = generateSubscription(
  MOCK_CG_BASIC_DATA,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_BASIC_WITH_DISCOUNT]
);

export const MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MULTI_TIER: SubscriptionsResponse = generateSubscription(
  MOCK_CG_BASIC_DATA,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_BASIC_WITH_DISCOUNT, TIER_2_WITH_DISCOUNT]
);

export const MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_RE_BASIC_DATA_MAPPED,
  MOCK_SUBSCRIBED_DATA,
  [TIER_WITH_DISCOUNT, TIER_WITH_DISCOUNT_WITHOUT_LIMIT]
);

export const MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_CARS_BASIC_DATA_MAPPED,
  MOCK_SUBSCRIBED_DATA,
  [TIER_WITH_DISCOUNT, TIER_WITH_DISCOUNT_WITHOUT_LIMIT]
);

export const MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_CARS_BASIC_DATA_MAPPED,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_WITH_DISCOUNT, TIER_WITH_DISCOUNT_WITHOUT_LIMIT]
);

export const MOCK_SUBSCRIPTION_CARS_WITH_LIMITS: SubscriptionsResponse = generateSubscription(
  MOCK_CARS_BASIC_DATA_MAPPED,
  MOCK_SUBSCRIBED_DATA,
  [TIER_WITH_DISCOUNT, TIER_2_WITH_DISCOUNT]
);

export const MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_CG_BASIC_DATA_MAPPED,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_BASIC_WITH_DISCOUNT]
);

export const MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_CG_BASIC_DATA_MAPPED,
  MOCK_SUBSCRIBED_DATA,
  [TIER_BASIC_WITH_DISCOUNT]
);

export const MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS: SubscriptionsResponse = generateSubscription(
  MOCK_CARS_BASIC_DATA_MAPPED,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_NO_DISCOUNT_NO_BASIC, TIER_NO_DISCOUNT_NO_BASIC_NO_LIMIT]
);

export const FREE_TRIAL_AVAILABLE_SUBSCRIPTION: SubscriptionsResponse = generateSubscription(
  MOCK_MOTORBIKE_BASIC_DATA_MAPPED,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_WITH_DISCOUNT, TIER_WITH_DISCOUNT_WITHOUT_LIMIT],
  null,
  true
);

export const FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION: SubscriptionsResponse = generateSubscription(
  MOCK_MOTORBIKE_BASIC_DATA_MAPPED,
  MOCK_NO_SUBSCRIBED_DATA,
  [TIER_NO_DISCOUNT_NO_BASIC, TIER_NO_DISCOUNT_NO_BASIC_NO_LIMIT],
  null,
  true
);

export const MOCK_SUBSCRIPTION_MOTORBIKE_SUBSCRIBED_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_MOTORBIKE_BASIC_DATA_MAPPED,
  MOCK_SUBSCRIBED_DATA,
  [TIER_NO_DISCOUNT_NO_BASIC, TIER_NO_DISCOUNT_NO_BASIC_NO_LIMIT],
  null
);

export const SUBSCTIPTION_WITH_TIER_DISCOUNT: SubscriptionsResponse[] = [MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED];

export const MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_CG_BASIC_DATA_MAPPED,
  MOCK_SUBSCRIBED_DATA_WITH_CANCELATION,
  [TIER_BASIC_WITH_DISCOUNT]
);

export const SUBSCRIPTIONS: SubscriptionsResponse[] = [
  MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
];

export const SUBSCRIPTIONS_WITH_ONE_FREE_TRIAL: SubscriptionsResponse[] = [
  MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
  FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION,
];

export const SUBSCRIPTIONS_NOT_SUB: SubscriptionsResponse[] = [
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
];

export const MAPPED_SUBSCRIPTIONS_WITH_RE: SubscriptionsResponse[] = [MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED];

export const SUBSCRIPTION_SUCCESS: SubscriptionResponse = {
  id: 'c040cfbe-0c2e-1a28-1224-4df193f0082c',
  latest_invoice_id: 'in_1FCTUQKhcEtiGcVWUQ5zweMx',
  payment_secret_key: 'pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC',
  payment_status: 'succeeded',
  status: 'active',
  subscription_plan_id: 'plan_FSWGMZq6tDdiKc',
};

export const SUBSCRIPTION_REQUIRES_ACTION: SubscriptionResponse = {
  id: 'c040cfbe-0c2e-1a28-1224-4df193f0082c',
  latest_invoice_id: 'in_1FCTUQKhcEtiGcVWUQ5zweMx',
  payment_secret_key: 'pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC',
  payment_status: 'requires_action',
  status: 'active',
  subscription_plan_id: 'plan_FSWGMZq6tDdiKc',
};

export const SUBSCRIPTION_REQUIRES_PAYMENT: SubscriptionResponse = {
  id: 'c040cfbe-0c2e-1a28-1224-4df193f0082c',
  latest_invoice_id: 'in_1FCTUQKhcEtiGcVWUQ5zweMx',
  payment_secret_key: 'pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC',
  payment_status: 'requires_payment_method',
  status: 'active',
  subscription_plan_id: 'plan_FSWGMZq6tDdiKc',
};

export const MOCK_RESPONSE_V3_SUBSCRIPTIONS: SubscriptionsV3Response[] = [
  {
    ...MOCK_SUBSCRIPTION_RE_SUBSCRIBED_NO_MAPPED,
    id: 'b522fba0-f685-4d78-8aa6-06d912619c06',
  },
  {
    ...MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_NO_DISCOUNTS,
    id: 'b522fba0-f685-4d78-8aa6-06d912619c07',
  },
  {
    ...MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED,
    id: 'b522fba0-f685-4d78-8aa6-06d912619c08',
  },
];

export const MOCK_V3_MAPPED_SUBSCRIPTIONS: SubscriptionsResponse[] = [
  {
    ...MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED,
    id: 'b522fba0-f685-4d78-8aa6-06d912619c06',
  },
  {
    ...MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS,
    id: 'b522fba0-f685-4d78-8aa6-06d912619c07',
  },
  {
    ...MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
    id: 'b522fba0-f685-4d78-8aa6-06d912619c08',
  },
];

export const MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS: SubscriptionsV3Response[] = [
  {
    ...MOCK_SUBSCRIPTION_RE_SUBSCRIBED_NO_MAPPED,
    tiers: [
      {
        ...TIER_WITH_DISCOUNT_NO_MAPPED,
        perks: [
          { name: PERK_NAMES.LIMIT, quantity: 5 },
          {
            name: BUMP_NAMES.CITYBUMP,
            quantity: 12,
            used: 5,
            duration_days: 6,
          },
        ],
      },
    ],
    id: 'b522fba0-f685-4d78-8aa6-06d912619c06',
  },
  {
    ...MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_NO_DISCOUNTS,
    tiers: [
      {
        ...TIER_WITH_DISCOUNT_NO_MAPPED,
        perks: [
          { name: PERK_NAMES.LIMIT, quantity: 5 },
          {
            name: BUMP_NAMES.CITYBUMP,
            quantity: 12,
            used: 5,
            duration_days: 6,
          },
          {
            name: BUMP_NAMES.ZONEBUMP,
            quantity: 8,
            used: 5,
            duration_days: 6,
          },
        ],
      },
    ],
    id: 'b522fba0-f685-4d78-8aa6-06d912619c07',
  },
  {
    ...MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED,
    id: 'b522fba0-f685-4d78-8aa6-06d912619c08',
  },
];

export const MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED: SubscriptionsResponse[] = [
  {
    ...MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED,
    tiers: [
      {
        ...TIER_NO_DISCOUNT_NO_BASIC,
        perks: [
          { name: PERK_NAMES.LIMIT, quantity: 5 },
          {
            name: BUMP_NAMES.CITYBUMP,
            quantity: 12,
            used: 5,
            duration_days: 6,
          },
        ],
        bumps: [
          {
            name: BUMP_NAMES.CITYBUMP,
            quantity: 12,
            used: 5,
            duration_days: 6,
          },
        ],
      },
    ],
    id: 'b522fba0-f685-4d78-8aa6-06d912619c06',
  },
  {
    ...MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
    tiers: [
      {
        ...TIER_WITH_DISCOUNT_NO_MAPPED,
        perks: [
          { name: PERK_NAMES.LIMIT, quantity: 5 },
          {
            name: BUMP_NAMES.CITYBUMP,
            quantity: 12,
          },
          {
            name: BUMP_NAMES.ZONEBUMP,
            quantity: 8,
          },
        ],
        bumps: [
          {
            name: BUMP_NAMES.CITYBUMP,
            quantity: 12,
            used: 5,
            duration_days: 6,
          },
          {
            name: BUMP_NAMES.ZONEBUMP,
            quantity: 8,
            used: 5,
            duration_days: 6,
          },
        ],
      },
    ],
    id: 'b522fba0-f685-4d78-8aa6-06d912619c07',
  },
  {
    ...MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED,
    id: 'b522fba0-f685-4d78-8aa6-06d912619c08',
  },
];

export const MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED: SubscriptionsResponse[] = [
  {
    ...MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
    selected_tier: {
      ...TIER_WITH_DISCOUNT,
      perks: [
        { name: PERK_NAMES.LIMIT, quantity: 5 },
        {
          name: PERK_NAMES.ZONEBUMP,
          quantity: 12,
          duration_days: 2,
        },
      ],
      bumps: [
        {
          name: PERK_NAMES.ZONEBUMP,
          quantity: 12,
          duration_days: 2,
        },
      ],
    },
    tiers: [
      {
        ...TIER_WITH_DISCOUNT,
        perks: [
          { name: PERK_NAMES.LIMIT, quantity: 5 },
          {
            name: PERK_NAMES.COUNTRYBUMP,
            quantity: 12,
            duration_days: 2,
          },
        ],
        bumps: [
          {
            name: PERK_NAMES.ZONEBUMP,
            quantity: 12,
            duration_days: 2,
          },
        ],
      },
    ],
    id: 'b522fba0-f685-4d78-8aa6-06d912619c06',
  },
  {
    ...MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED,
    tiers: [
      {
        ...TIER_WITH_DISCOUNT,
        bumps: [
          {
            name: PERK_NAMES.COUNTRYBUMP,
            quantity: 12,
            duration_days: 2,
          },
          {
            name: PERK_NAMES.ZONEBUMP,
            quantity: 8,
            duration_days: 2,
          },
        ],
        perks: [
          { name: PERK_NAMES.LIMIT, quantity: 5 },
          {
            name: PERK_NAMES.COUNTRYBUMP,
            quantity: 12,
            duration_days: 2,
          },
          {
            name: PERK_NAMES.ZONEBUMP,
            quantity: 8,
            duration_days: 2,
          },
        ],
      },
    ],
    id: 'b522fba0-f685-4d78-8aa6-06d912619c07',
  },
  {
    ...MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
    selected_tier: {
      ...TIER_WITH_DISCOUNT,
      perks: [
        { name: PERK_NAMES.LIMIT, quantity: 5 },
        {
          name: PERK_NAMES.COUNTRYBUMP,
          quantity: 12,
          duration_days: 2,
        },
      ],
      bumps: [
        {
          name: PERK_NAMES.COUNTRYBUMP,
          quantity: 12,
          duration_days: 2,
        },
      ],
    },
    tiers: [
      {
        ...TIER_WITH_DISCOUNT,
        perks: [
          { name: PERK_NAMES.LIMIT, quantity: 5 },
          {
            name: PERK_NAMES.COUNTRYBUMP,
            quantity: 12,
            duration_days: 2,
          },
        ],
        bumps: [
          {
            name: PERK_NAMES.COUNTRYBUMP,
            quantity: 12,
            duration_days: 2,
          },
        ],
      },
    ],
    id: 'b522fba0-f685-4d78-8aa6-06d912619c06',
  },
];
