import { SubscriptionsResponse, SubscriptionsV3Response, SUBSCRIPTION_CATEGORY_TYPES, Tier } from '../subscriptions.interface';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '../category-subscription-ids';
import { CURRENCY_SYMBOLS } from '@core/constants';

export const subscriptionMapper = {
  [SUBSCRIPTION_CATEGORY_TYPES.CARS]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.CAR,
    icon_id: 'car',
    label: $localize`:@@web_filters_category_cars:Cars`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.MOTORBIKES]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE,
    icon_id: 'motorbike',
    label: $localize`:@@web_filters_category_motorbike:Motorbike`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.CAR_PARTS]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.MOTOR_ACCESSORIES,
    icon_id: 'helmet',
    label: $localize`:@@web_filters_category_motors_n_accessories:Motors & Accessories`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.REAL_ESTATE]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE,
    icon_id: 'house',
    label: $localize`:@@web_filters_category_real_estate:Real Estate`,
  },
  [SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS,
    icon_id: 'All',
    label: $localize`:@@web_consumer_goods_category_name:Everything else`,
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
    selected_tier: getSelectedTier(subscription),
  };

  mapCurrenciesForTiers(subscriptionMapped);

  return subscriptionMapped;
}

function getSelectedTier(subscription: SubscriptionsV3Response): Tier {
  const tierId = subscription.selected_tier_id ? subscription.selected_tier_id : subscription.default_tier_id;
  return subscription.tiers.find((tier) => tier.id === tierId);
}

function mapCurrenciesForTiers(subscription: SubscriptionsResponse) {
  subscription.tiers.forEach((tier) => {
    const mappedCurrencyCharacter = CURRENCY_SYMBOLS[tier.currency];
    if (mappedCurrencyCharacter) {
      tier.currency = mappedCurrencyCharacter;
    }
    if (tier.discount) {
      const oneDay = 1000 * 60 * 60 * 24;
      tier.discount.no_discount_date = tier.discount.end_date + oneDay;
    }
  });
}
