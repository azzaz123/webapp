import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickChatButton,
  ClickItemCard,
  FavoriteItem,
  SaveAddress,
  SCREEN_IDS,
  ShareItem,
  UnfavoriteItem,
  ViewItemDetailRecommendationSlider,
  ViewOthersItemCarDetail,
  ViewOthersItemCGDetail,
  ViewOthersItemREDetail,
  ViewOwnItemDetail,
  ViewShippingAddress,
  ViewShippingTransactions,
} from '@core/analytics/analytics-constants';
import { USER_TYPE } from '@core/user/user.service';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MOCK_CAR_ITEM_DETAIL } from '@fixtures/item-detail.fixtures.spec';
import { MOCK_ITEM, MOCK_ITEM_GBP } from '@fixtures/item.fixtures.spec';
import { MOCK_REALESTATE } from '@fixtures/realestate.fixtures.spec';
import { MOCK_OTHER_USER, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { RECOMMENDATIONS_ENGINE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { RECOMMENDED_ITEM_IDS_MOCK } from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';

export const MOCK_ITEM_INDEX: number = 2;
import { SOCIAL_SHARE_CHANNELS } from '@shared/social-share/enums/social-share-channels.enum';

export const MOCK_CLICK_CHAT_BUTTON_EVENT: AnalyticsEvent<ClickChatButton> = {
  name: ANALYTICS_EVENT_NAMES.ClickChatButton,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    itemId: MOCK_ITEM.id,
    sellerUserId: MOCK_USER.id,
    screenId: SCREEN_IDS.ItemDetail,
    isPro: MOCK_USER.featured,
    isBumped: !!MOCK_ITEM.bumpFlags?.bumped,
    shippingAllowed: null,
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
    sellerCountry: 'ES',
  },
};

export const MOCK_FAVOURITE_ITEM_EVENT: AnalyticsEvent<FavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.FavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_CAR_ITEM_DETAIL.item.id,
    categoryId: MOCK_CAR_ITEM_DETAIL.item.categoryId,
    screenId: SCREEN_IDS.ItemDetail,
    salePrice: MOCK_CAR_ITEM_DETAIL.item.salePrice,
    isPro: MOCK_CAR_ITEM_DETAIL.user.featured,
    title: MOCK_CAR_ITEM_DETAIL.item.title,
    isBumped: !!MOCK_CAR_ITEM_DETAIL.item.bumpFlags?.bumped,
  },
};

export const MOCK_FAVOURITE_ITEM_EVENT_FROM_RECOMMENDED_SLIDER: AnalyticsEvent<FavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.FavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_ITEM_CARD.id,
    categoryId: MOCK_ITEM_CARD.categoryId,
    screenId: SCREEN_IDS.ItemDetailRecommendationSlider,
    salePrice: MOCK_ITEM_CARD.salePrice,
    isPro: MOCK_USER.featured,
    title: MOCK_ITEM_CARD.title,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};

export const MOCK_UNFAVOURITE_ITEM_EVENT: AnalyticsEvent<UnfavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.UnfavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_CAR_ITEM_DETAIL.item.id,
    categoryId: MOCK_CAR_ITEM_DETAIL.item.categoryId,
    screenId: SCREEN_IDS.ItemDetail,
    salePrice: MOCK_CAR_ITEM_DETAIL.item.salePrice,
    isPro: MOCK_CAR_ITEM_DETAIL.user.featured,
    title: MOCK_CAR_ITEM_DETAIL.item.title,
    isBumped: !!MOCK_CAR_ITEM_DETAIL.item.bumpFlags?.bumped,
  },
};

export const MOCK_UNFAVOURITE_ITEM_EVENT_FROM_RECOMMENDED_SLIDER: AnalyticsEvent<FavoriteItem> = {
  name: ANALYTICS_EVENT_NAMES.UnfavoriteItem,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    itemId: MOCK_ITEM_CARD.id,
    categoryId: MOCK_ITEM_CARD.categoryId,
    screenId: SCREEN_IDS.ItemDetailRecommendationSlider,
    salePrice: MOCK_ITEM_CARD.salePrice,
    isPro: MOCK_USER.featured,
    title: MOCK_ITEM_CARD.title,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};

export const MOCK_CLICK_ITEM_CARD_EVENT: AnalyticsEvent<ClickItemCard> = {
  name: ANALYTICS_EVENT_NAMES.ClickItemCard,
  eventType: ANALYTIC_EVENT_TYPES.Navigation,
  attributes: {
    itemId: MOCK_ITEM_CARD.id,
    categoryId: MOCK_ITEM_CARD.categoryId,
    position: MOCK_ITEM_INDEX + 1,
    screenId: SCREEN_IDS.ItemDetailRecommendationSlider,
    isPro: MOCK_OTHER_USER.featured,
    isCarDealer: MOCK_OTHER_USER?.type === USER_TYPE.PROFESSIONAL,
    salePrice: MOCK_ITEM_CARD.salePrice,
    title: MOCK_ITEM_CARD.title,
    itemSourceRecommendationId: MOCK_ITEM.id,
    shippingAllowed: !!MOCK_ITEM_CARD.saleConditions?.shipping_allowed,
    sellerUserId: MOCK_ITEM_CARD.ownerId,
    isBumped: !!MOCK_ITEM_CARD.bumpFlags?.bumped,
  },
};

export const MOCK_FB_SHARE_ITEM_EVENT: AnalyticsEvent<ShareItem> = {
  name: ANALYTICS_EVENT_NAMES.ShareItem,
  eventType: ANALYTIC_EVENT_TYPES.Social,
  attributes: {
    itemId: MOCK_CAR.id,
    categoryId: MOCK_CAR.categoryId,
    channel: SOCIAL_SHARE_CHANNELS.FACEBOOK,
    screenId: SCREEN_IDS.ItemDetail,
    isPro: MOCK_USER.featured,
    salePrice: MOCK_CAR.salePrice,
  },
};

export const MOCK_TWITTER_SHARE_ITEM_EVENT: AnalyticsEvent<ShareItem> = {
  name: ANALYTICS_EVENT_NAMES.ShareItem,
  eventType: ANALYTIC_EVENT_TYPES.Social,
  attributes: {
    itemId: MOCK_CAR.id,
    categoryId: MOCK_CAR.categoryId,
    channel: SOCIAL_SHARE_CHANNELS.TWITTER,
    screenId: SCREEN_IDS.ItemDetail,
    isPro: MOCK_USER.featured,
    salePrice: MOCK_CAR.salePrice,
  },
};

export const MOCK_EMAIL_SHARE_ITEM_EVENT: AnalyticsEvent<ShareItem> = {
  name: ANALYTICS_EVENT_NAMES.ShareItem,
  eventType: ANALYTIC_EVENT_TYPES.Social,
  attributes: {
    itemId: MOCK_CAR.id,
    categoryId: MOCK_CAR.categoryId,
    channel: SOCIAL_SHARE_CHANNELS.EMAIL,
    screenId: SCREEN_IDS.ItemDetail,
    isPro: MOCK_USER.featured,
    salePrice: MOCK_CAR.salePrice,
  },
};

export const MOCK_VIEW_OTHERS_ITEM_RE_DETAIL_EVENT: AnalyticsPageView<ViewOthersItemREDetail> = {
  name: ANALYTICS_EVENT_NAMES.ViewOthersItemREDetail,
  attributes: {
    itemId: MOCK_REALESTATE.id,
    categoryId: MOCK_REALESTATE.categoryId,
    salePrice: MOCK_REALESTATE.salePrice,
    title: MOCK_REALESTATE.title,
    operation: MOCK_REALESTATE.operation,
    type: MOCK_REALESTATE.type,
    condition: MOCK_REALESTATE.condition,
    surface: MOCK_REALESTATE.surface,
    rooms: MOCK_REALESTATE.rooms,
    isPro: MOCK_OTHER_USER.featured,
    screenId: SCREEN_IDS.ItemDetail,
    sellerCountry: 'ES',
  },
};

export const MOCK_VIEW_OTHERS_ITEM_CAR_DETAIL_EVENT: AnalyticsPageView<ViewOthersItemCarDetail> = {
  name: ANALYTICS_EVENT_NAMES.ViewOthersItemCarDetail,
  attributes: {
    itemId: MOCK_CAR.id,
    categoryId: MOCK_CAR.categoryId,
    salePrice: MOCK_CAR.salePrice,
    brand: MOCK_CAR.brand,
    model: MOCK_CAR.model,
    year: MOCK_CAR.year,
    km: MOCK_CAR.km,
    gearbox: MOCK_CAR.gearbox,
    engine: MOCK_CAR.engine,
    colour: MOCK_CAR.color,
    hp: MOCK_CAR.horsepower,
    numDoors: MOCK_CAR.numDoors,
    bodyType: MOCK_CAR.bodyType,
    isCarDealer: true,
    isPro: MOCK_CAR_ITEM_DETAIL.user.featured,
    screenId: SCREEN_IDS.ItemDetail,
    sellerCountry: 'ES',
  },
};

export const MOCK_VIEW_OTHERS_ITEM_CAR_DETAIL_EVENT_NON_CARDEALER: AnalyticsPageView<ViewOthersItemCarDetail> = {
  ...MOCK_VIEW_OTHERS_ITEM_CAR_DETAIL_EVENT,
  attributes: {
    ...MOCK_VIEW_OTHERS_ITEM_CAR_DETAIL_EVENT.attributes,
    isCarDealer: false,
  },
};

export const MOCK_VIEW_ITEM_DETAIL_RECOMMENDEATION_SLIDER_EVENT: AnalyticsPageView<ViewItemDetailRecommendationSlider> = {
  name: ANALYTICS_EVENT_NAMES.ViewItemDetailRecommendationSlider,
  attributes: {
    itemSourceId: MOCK_ITEM.id,
    categoryId: MOCK_ITEM.categoryId,
    engine: RECOMMENDATIONS_ENGINE.MORE_LIKE_THIS_SOLR,
    recommendedItemIds: RECOMMENDED_ITEM_IDS_MOCK,
    screenId: SCREEN_IDS.ItemDetail,
    isPro: MOCK_USER.featured,
  },
};

export const MOCK_SAVE_DELIVERY_ADDRESS_EVENT: AnalyticsEvent<SaveAddress> = {
  name: ANALYTICS_EVENT_NAMES.SaveAddress,
  eventType: ANALYTIC_EVENT_TYPES.UserPreference,
  attributes: {
    screenId: SCREEN_IDS.EditAddress,
  },
};

export const MOCK_VIEW_SHIPPING_ADDRESS_SCREEN_EVENT: AnalyticsPageView<ViewShippingAddress> = {
  name: ANALYTICS_EVENT_NAMES.ViewShippingAddress,
  attributes: {
    screenId: SCREEN_IDS.MyShippingAddress,
  },
};

export const MOCK_VIEW_STREAMLINE_SCREEN_EVENT: AnalyticsPageView<ViewShippingTransactions> = {
  name: ANALYTICS_EVENT_NAMES.ViewShippingTransactions,
  attributes: {
    screenId: SCREEN_IDS.MyShippingTransactions,
  },
};

export class MockItemdDetailTrackEventService {
  trackFavouriteOrUnfavouriteEvent() {}
  trackClickChatButton() {}
  trackClickItemCardEvent() {}
  trackViewOwnItemDetail() {}
  trackViewOthersCGDetailEvent() {}
  trackViewOthersItemREDetailEvent() {}
  trackViewOthersItemCarDetailEvent() {}
  trackViewItemDetailRecommendationSliderEvent() {}
  trackShareItemEvent() {}
}
