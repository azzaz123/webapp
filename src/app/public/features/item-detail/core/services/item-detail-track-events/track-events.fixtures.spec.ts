import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickChatButton,
  FavoriteItem,
  SCREEN_IDS,
  UnfavoriteItem,
  ViewOthersItemCGDetail,
  ViewOwnItemDetail,
} from '@core/analytics/analytics-constants';
import { MOCK_CAR_ITEM_DETAIL } from '@fixtures/item-detail.fixtures.spec';
import { MOCK_ITEM, MOCK_ITEM_GBP } from '@fixtures/item.fixtures.spec';
import { MOCK_OTHER_USER, MOCK_USER } from '@fixtures/user.fixtures.spec';

export const MOCK_CLICK_CHAT_BUTTON_EVENT: AnalyticsEvent<ClickChatButton> = {
  name: ANALYTICS_EVENT_NAMES.ClickChatButton,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    itemId: MOCK_ITEM.id,
    sellerUserId: MOCK_USER.id,
    screenId: SCREEN_IDS.ItemDetail,
    isPro: MOCK_USER.featured,
    isBumped: !!MOCK_ITEM.bumpFlags,
  },
};

export const MOCK_VIEW_OWN_ITEM_DETAIL_EVENT: AnalyticsPageView<ViewOwnItemDetail> = {
  name: ANALYTICS_EVENT_NAMES.ViewOwnItemDetail,
  attributes: {
    itemId: MOCK_CAR_ITEM_DETAIL.item.id,
    categoryId: MOCK_CAR_ITEM_DETAIL.item.categoryId,
    salePrice: MOCK_CAR_ITEM_DETAIL.item.salePrice,
    title: MOCK_CAR_ITEM_DETAIL.item.title,
    isPro: MOCK_CAR_ITEM_DETAIL.user.featured,
    screenId: SCREEN_IDS.ItemDetail,
    isActive: !MOCK_CAR_ITEM_DETAIL.item.flags?.onhold,
  },
};

export const MOCK_VIEW_OTHERS_CG_DETAIL_EVENT: AnalyticsPageView<ViewOthersItemCGDetail> = {
  name: ANALYTICS_EVENT_NAMES.ViewOthersItemCGDetail,
  attributes: {
    itemId: MOCK_ITEM_GBP.id,
    categoryId: MOCK_ITEM_GBP.categoryId,
    salePrice: MOCK_ITEM_GBP.salePrice,
    title: MOCK_ITEM_GBP.title,
    isPro: MOCK_OTHER_USER.featured,
    screenId: SCREEN_IDS.ItemDetail,
  },
};

export const MOCK_FAVORITE_ITEM_EVENT: AnalyticsEvent<FavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.FavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_CAR_ITEM_DETAIL.item.id,
    categoryId: MOCK_CAR_ITEM_DETAIL.item.categoryId,
    screenId: SCREEN_IDS.ItemDetail,
    salePrice: MOCK_CAR_ITEM_DETAIL.item.salePrice,
    isPro: MOCK_CAR_ITEM_DETAIL.user.featured,
    title: MOCK_CAR_ITEM_DETAIL.item.title,
    isBumped: !!MOCK_CAR_ITEM_DETAIL.item.bumpFlags,
  },
};

export const MOCK_UNFAVORITE_ITEM_EVENT: AnalyticsEvent<UnfavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.UnfavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_CAR_ITEM_DETAIL.item.id,
    categoryId: MOCK_CAR_ITEM_DETAIL.item.categoryId,
    screenId: SCREEN_IDS.ItemDetail,
    salePrice: MOCK_CAR_ITEM_DETAIL.item.salePrice,
    isPro: MOCK_CAR_ITEM_DETAIL.user.featured,
    title: MOCK_CAR_ITEM_DETAIL.item.title,
    isBumped: !!MOCK_CAR_ITEM_DETAIL.item.bumpFlags,
  },
};
