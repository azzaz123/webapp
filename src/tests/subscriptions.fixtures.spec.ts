import { Observable, of } from 'rxjs';

import {
  SubscriptionResponse,
  SubscriptionsResponse,
  Tier,
  SubscriptionSlotResponse,
  SubscriptionSlot,
  SubscriptionSlotGeneralResponse,
  SUBSCRIPTION_MARKETS,
  TierDiscount,
  SUBSCRIPTION_CATEGORY_TYPES,
  SubscriptionsV3Response,
} from '../app/core/subscriptions/subscriptions.interface';
import { CATEGORY_DATA_WEB } from './category.fixtures.spec';
import { SUBSCRIPTION_TYPES } from '../app/core/subscriptions/subscriptions.service';
import { SubscriptionBenefit } from '@core/subscriptions/subscription-benefits/interfaces/subscription-benefit.interface';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { CATEGORY_IDS } from '@core/category/category-ids';

export class MockSubscriptionService {
  getSubscriptions() {
    return of(SUBSCRIPTIONS);
  }

  public getSlots() {
    return of([]);
  }

  public getSlotCategory(_id) {
    return of([]);
  }

  public getUserSubscriptionType() {
    return of(SUBSCRIPTION_TYPES.stripe);
  }

  public getSubscriptionBenefits() {
    return of(MOCK_SUBSCRIPTION_BENEFITS);
  }

  public isSubscriptionInApp(subscription: SubscriptionsResponse): boolean {
    if (!subscription.market) {
      return false;
    }
    return subscription.market === SUBSCRIPTION_MARKETS.GOOGLE_PLAY || subscription.market === SUBSCRIPTION_MARKETS.APPLE_STORE;
  }

  public isOneSubscriptionInApp(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some((subscription) => this.isSubscriptionInApp(subscription));
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
    return of({});
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

export const MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE: SubscriptionSlotResponse = {
  category_id: 100,
  available: 3,
  limit: 10,
};

export const MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE: SubscriptionSlotResponse = {
  category_id: 14000,
  available: 2,
  limit: 10,
};

export const MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE: SubscriptionSlotResponse = {
  category_id: 12800,
  available: 0,
  limit: 10,
};

export const MOCK_SUBSCRIPTION_SLOTS_RESPONSE: SubscriptionSlotResponse[] = [
  MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE,
  MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE,
  MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE,
];

export const MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE: SubscriptionSlotGeneralResponse = {
  slots: MOCK_SUBSCRIPTION_SLOTS_RESPONSE,
};

export const MOCK_SUBSCRIPTION_SLOT_CARS: SubscriptionSlot = {
  category: CATEGORY_DATA_WEB[0],
  available: MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE.available,
  limit: MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE.limit,
};

export const MOCK_SUBSCRIPTION_SLOT_MOTORBIKES: SubscriptionSlot = {
  category: CATEGORY_DATA_WEB[3],
  available: MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE.available,
  limit: MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE.limit,
};

export const MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES: SubscriptionSlot = {
  category: CATEGORY_DATA_WEB[4],
  available: MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE.available,
  limit: MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE.limit,
};

export const MOCK_SUBSCRIPTION_SLOTS: SubscriptionSlot[] = [
  MOCK_SUBSCRIPTION_SLOT_CARS,
  MOCK_SUBSCRIPTION_SLOT_MOTORBIKES,
  MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES,
];

export const TIER_DISCOUNT: TierDiscount = {
  end_date: 1640908800000,
  percentage: 50,
  price: 9.5,
  no_discount_date: 1640908800000,
};

export const TIER_WITH_DISCOUNT: Tier = {
  id: 'plan_FWuFVeTHEDyECd',
  limit: 9,
  price: 9.99,
  currency: '€',
  discount: TIER_DISCOUNT,
  is_basic: false,
};

export const TIER_2_WITH_DISCOUNT: Tier = {
  ...TIER_WITH_DISCOUNT,
  id: 'plan_FWuFVeTHEDyECz',
  limit: 50,
};

export const TIER_WITH_DISCOUNT_WITHOUT_LIMIT: Tier = {
  ...TIER_WITH_DISCOUNT,
  id: 'plan_FWuFVeTHEDyECe',
  limit: null,
};

export const TIER_BASIC_WITH_DISCOUNT: Tier = {
  id: 'plan_FWuFVeTHEDyECa',
  limit: 9,
  price: 9.99,
  currency: '€',
  discount: TIER_DISCOUNT,
  is_basic: true,
};

export const TIER_NO_DISCOUNT_NO_BASIC: Tier = {
  id: 'plan_FWuFVeTHEDyECb',
  limit: 9,
  price: 9.99,
  currency: '€',
  discount: null,
  is_basic: false,
};

export const TIER_NO_DISCOUNT_NO_BASIC_NO_LIMIT: Tier = {
  id: 'plan_FWuFVeTHEDyECc',
  price: 9.99,
  currency: '€',
  discount: null,
  is_basic: false,
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

export const MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_GOOGLE_PLAY_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_CG_BASIC_DATA_MAPPED,
  MOCK_SUBSCRIBED_DATA,
  [TIER_BASIC_WITH_DISCOUNT],
  SUBSCRIPTION_MARKETS.GOOGLE_PLAY
);

export const MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_APPLE_STORE_MAPPED: SubscriptionsResponse = generateSubscription(
  MOCK_CG_BASIC_DATA_MAPPED,
  MOCK_SUBSCRIBED_DATA,
  [TIER_BASIC_WITH_DISCOUNT],
  SUBSCRIPTION_MARKETS.APPLE_STORE
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

export const MOCK_SUBSCRIPTIONS_WITH_ONE_GOOGLE_PLAY: SubscriptionsResponse[] = [
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_GOOGLE_PLAY_MAPPED,
];

export const MOCK_SUBSCRIPTIONS_WITH_ONE_APPLE_STORE: SubscriptionsResponse[] = [
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_APPLE_STORE_MAPPED,
];

export const SUBSCRIPTIONS_NOT_SUB: SubscriptionsResponse[] = [
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
];

export const MAPPED_SUBSCRIPTIONS_WITH_RE: SubscriptionsResponse[] = [MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED];

export const MAPPED_SUBSCRIPTIONS_WITH_INAPP: SubscriptionsResponse[] = MOCK_SUBSCRIPTIONS_WITH_ONE_APPLE_STORE;

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
    ...MOCK_SUBSCRIPTION_RE_SUBSCRIBED,
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
