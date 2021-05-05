import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCard,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MOCK_OTHER_USER } from '@fixtures/user.fixtures.spec';
import { MOCK_ITEM_INDEX } from '../../../item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';

export const MOCK_SEARCH_ID: string = 'e72c12f7-c662-421a-a821-6ad54d110d76';
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
    salePrice: MOCK_ITEM_CARD.salePrice,
    title: MOCK_ITEM_CARD.title,
    itemDistance: MOCK_ITEM_CARD.distance,
    shippingAllowed: !!MOCK_ITEM_CARD.saleConditions?.shipping_allowed,
    sellerUserId: MOCK_ITEM_CARD.ownerId,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};
