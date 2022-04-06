import {
  Bumps,
  BUMP_NAMES,
  Perks,
  PERK_NAMES,
  SubscriptionsResponse,
  SUBSCRIPTION_CATEGORY_TYPES,
  SUBSCRIPTION_MARKETS,
  Tier,
} from '../subscriptions.interface';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '../category-subscription-ids';
import { CURRENCY_SYMBOLS } from '@core/constants';
import { SubscriptionsV3Response, TierDto } from '../dtos/subscriptions/subscription-response.interface';
import { CanEditSubscriptionResponseDto } from '@core/subscriptions/dtos/subscriptions/can-edit.subscription.interface';
import * as moment from 'moment';
import { CanEditSubscriptionResponse } from '@api/core/model/subscriptions/can-edit-subscription/can-edit-subscription.interface';

export const subscriptionMapper: Record<SUBSCRIPTION_CATEGORY_TYPES, { category_id: number; icon_id: string; label: string }> = {
  [SUBSCRIPTION_CATEGORY_TYPES.CARS]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.CAR,
    icon_id: 'car',
    label: $localize`:@@generic_pro_subscription_naming_cars:Cars`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.MOTORBIKES]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE,
    icon_id: 'motorbike',
    label: $localize`:@@generic_pro_subscription_naming_motorbikes:Motorbike`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.CAR_PARTS]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.MOTOR_ACCESSORIES,
    icon_id: 'helmet',
    label: $localize`:@@generic_pro_subscription_naming_motors_accesories:Motors & Accessories`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.REAL_ESTATE]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE,
    icon_id: 'house',
    label: $localize`:@@generic_pro_subscription_naming_real_estate:Real Estate`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS,
    icon_id: 'All',
    label: $localize`:@@generic_pro_subscription_naming_consumer_goods:Everything else`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.OLD_CONSUMER_GOODS]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS,
    icon_id: 'All',
    label: $localize`:@@web_consumer_goods_category_name:Everything else`,
  },
};

export function mapSubscriptions(subscriptions: SubscriptionsV3Response[]): SubscriptionsResponse[] {
  return subscriptions.map((subscription) => mapSubscription(subscription));
}

function mapSubscription(subscription: SubscriptionsV3Response): SubscriptionsResponse {
  let subscriptionMapped: SubscriptionsResponse = {
    ...subscription,
    category_id: subscriptionMapper[subscription.type].category_id,
    category_name: subscriptionMapper[subscription.type].label,
    category_icon: subscriptionMapper[subscription.type].icon_id,
    type: subscription.type as SUBSCRIPTION_CATEGORY_TYPES,
    market: subscription.market as SUBSCRIPTION_MARKETS,
    tiers: mapTiers(subscription.tiers),
    selected_tier: undefined,
  };

  if (subscription.selected_tier_id) {
    subscriptionMapped.selected_tier = subscriptionMapped.tiers.find((tier) => tier.id === subscription.selected_tier_id);
  }

  return subscriptionMapped;
}

function mapTiers(tiersDto: TierDto[]): Tier[] {
  return tiersDto.map((tierDto) => {
    const tier: Tier = {
      ...tierDto,
      limit: tierDto.perks.find((perk) => perk.name === PERK_NAMES.LIMIT)
        ? tierDto.perks.find((perk) => perk.name === PERK_NAMES.LIMIT).quantity
        : tierDto.limit,
      bumps: mapBumps(tierDto.perks),
    };

    const mappedCurrencyCharacter = CURRENCY_SYMBOLS[tier.currency];
    if (mappedCurrencyCharacter) {
      tier.currency = mappedCurrencyCharacter;
    }
    if (tier.discount) {
      const oneDay = 1000 * 60 * 60 * 24;
      tier.discount.no_discount_date = tier.discount.end_date + oneDay;
    }
    return tier;
  });
}

function mapBumps(perks: Perks[]): Bumps[] {
  const bumps: Bumps[] = [];
  perks
    .filter((perks) => Object.values(BUMP_NAMES).includes(perks.name as BUMP_NAMES))
    .map((bump) => {
      bumps.push({
        ...bump,
        name: bump.name as BUMP_NAMES,
        used: bump.used ? bump.used : 0,
        duration_days: bump.duration_days ? bump.duration_days : 0,
        extra: bump.extra ? bump.extra : 0,
      });
    });
  return bumps;
}

export function mapCanEditSubscription(response: CanEditSubscriptionResponseDto): CanEditSubscriptionResponse {
  return {
    allowed: response.allowed,
    renewalDate: moment(response.renewal_date).format('DD/MM/yyyy'),
  };
}
