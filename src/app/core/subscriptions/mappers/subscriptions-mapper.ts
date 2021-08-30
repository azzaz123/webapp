import { PublishedItem } from '@api/catalog/dtos';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { mapImageDtosToImages } from '@api/core/mappers';
import { formatDescription } from '@api/catalog/mappers/utils';
import { ItemType } from '@api/core/model/item';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { SubscriptionsResponse, SubscriptionsV3Response, SUBSCRIPTION_CATEGORY_TYPES, Tier } from '../subscriptions.interface';
import { CategoryResponse } from '@core/category/category-response.interface';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '../category-subscription-ids';
import { CURRENCY_SYMBOLS } from '@core/constants';

export const subscriptionMapper = {
  [SUBSCRIPTION_CATEGORY_TYPES.CARS]: { category_id: CATEGORY_SUBSCRIPTIONS_IDS.CAR, icon_id: 'car', label: 'test' },
  [SUBSCRIPTION_CATEGORY_TYPES.MOTORBIKES]: { category_id: CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE, icon_id: 'motorbike', label: 'test' },
  [SUBSCRIPTION_CATEGORY_TYPES.CAR_PARTS]: { category_id: CATEGORY_SUBSCRIPTIONS_IDS.MOTOR_ACCESSORIES, icon_id: 'helmet', label: 'test' },
  [SUBSCRIPTION_CATEGORY_TYPES.REAL_ESTATE]: { category_id: CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE, icon_id: 'house', label: 'test' },
  [SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS]: { category_id: CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS, icon_id: 'All', label: 'test' },
  [SUBSCRIPTION_CATEGORY_TYPES.OLD_CONSUMER_GOODS]: {
    category_id: CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS,
    icon_id: 'All',
    label: 'test',
  },
};

export function mapSubscriptions(subscription: SubscriptionsV3Response): SubscriptionsResponse {
  let subscriptionMapped: SubscriptionsResponse = { ...subscription, category_id: subscriptionMapper[subscription.type].category_id };

  subscriptionMapped.category_name = subscriptionMapper[subscription.type].label;
  subscriptionMapped.selected_tier = getSelectedTier(subscriptionMapped);
  subscriptionMapped.category_icon = subscriptionMapper[subscription.type].icon_id;

  mapCurrenciesForTiers(subscriptionMapped);

  return subscriptionMapped;
}

function getSelectedTier(subscription: SubscriptionsResponse): Tier {
  const selectedTier = subscription.selected_tier_id
    ? subscription.tiers.filter((tier) => tier.id === subscription.selected_tier_id)
    : subscription.tiers.filter((tier) => tier.id === subscription.default_tier_id);
  return selectedTier[0];
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
