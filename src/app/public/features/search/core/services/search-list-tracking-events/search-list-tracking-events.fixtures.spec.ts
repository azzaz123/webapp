import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCard,
  FavoriteItem,
  SCREEN_IDS,
  UnfavoriteItem,
} from '@core/analytics/analytics-constants';
import { USER_TYPE } from '@core/user/user.service';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MOCK_OTHER_USER } from '@fixtures/user.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { MOCK_ITEM_INDEX } from '../../../../item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';

export const MOCK_SEARCH_ID = 'e72c12f7-c662-421a-a821-6ad54d110d76';
export const MOCK_CLICK_ITEM_CARD_EVENT_FROM_SEARCH: AnalyticsEvent<ClickItemCard> = {
  name: ANALYTICS_EVENT_NAMES.ClickItemCard,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    itemId: MOCK_ITEM_CARD.id,
    categoryId: MOCK_ITEM_CARD.categoryId,
    position: MOCK_ITEM_INDEX + 1,
    screenId: SCREEN_IDS.Search,
    searchId: MOCK_SEARCH_ID,
    isPro: MOCK_OTHER_USER.featured,
    isCarDealer: MOCK_OTHER_USER?.type === USER_TYPE.PROFESSIONAL,
    salePrice: MOCK_ITEM_CARD.salePrice,
    title: MOCK_ITEM_CARD.title,
    itemDistance: MOCK_ITEM_CARD.distance,
    shippingAllowed: !!MOCK_ITEM_CARD.saleConditions?.shipping_allowed,
    sellerUserId: MOCK_ITEM_CARD.ownerId,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};

export const MOCK_FAVOURITE_ITEM_EVENT_FROM_SEARCH: AnalyticsEvent<FavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.FavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_ITEM_CARD.id,
    categoryId: MOCK_ITEM_CARD.categoryId,
    searchId: MOCK_SEARCH_ID,
    screenId: SCREEN_IDS.Search,
    isPro: false,
    salePrice: MOCK_ITEM_CARD.salePrice,
    title: MOCK_ITEM_CARD.title,
    sellerUserId: MOCK_ITEM_CARD.ownerId,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};

export const MOCK_UNFAVOURITE_ITEM_EVENT_FROM_SEARCH: AnalyticsEvent<UnfavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.UnfavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_ITEM_CARD.id,
    categoryId: MOCK_ITEM_CARD.categoryId,
    screenId: SCREEN_IDS.Search,
    isPro: false,
    salePrice: MOCK_ITEM_CARD.salePrice,
    title: MOCK_ITEM_CARD.title,
    sellerUserId: MOCK_ITEM_CARD.ownerId,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};

export class MockSearchListTrackingEventService {
  trackClickItemCardEvent() {}
  trackFavouriteItemEvent(item: ItemCard, searchId: string): void {}
  trackUnfavouriteItemEvent(item: ItemCard): void {}
}
