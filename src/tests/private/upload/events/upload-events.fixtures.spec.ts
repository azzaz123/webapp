import {
  AnalyticsEvent,
  EditItemCG,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  ListItemCG,
} from '@core/analytics/analytics-constants';
import { ItemContent } from '@core/item/item-response.interface';

export const MOCK_UPLOAD_PRODUCT_EDIT_ITEM_CG_SHIPPABLE_EVENT = (
  item: ItemContent,
  shippingAllowed: boolean,
  weight?: number
): AnalyticsEvent<EditItemCG> => {
  const event: AnalyticsEvent<EditItemCG> = {
    name: ANALYTICS_EVENT_NAMES.EditItemCG,
    eventType: ANALYTIC_EVENT_TYPES.Other,
    attributes: {
      itemId: item.id,
      categoryId: item.category_id,
      salePrice: item.sale_price,
      title: item.title,
      isPro: false,
      screenId: SCREEN_IDS.EditItem,
      shippingAllowed: shippingAllowed,
    },
  };

  if (weight) {
    event.attributes.shippingWeight = weight;
  }

  return event;
};

export const MOCK_UPLOAD_PRODUCT_LIST_ITEM_CG_SHIPPABLE_EVENT = (
  item: ItemContent,
  shippingAllowed: boolean,
  weight?: number
): AnalyticsEvent<ListItemCG> => {
  const event: AnalyticsEvent<ListItemCG> = {
    name: ANALYTICS_EVENT_NAMES.ListItemCG,
    eventType: ANALYTIC_EVENT_TYPES.Other,
    attributes: {
      itemId: item.id,
      categoryId: item.category_id,
      salePrice: item.sale_price,
      title: item.title,
      isPro: false,
      screenId: SCREEN_IDS.Upload,
      shippingAllowed: shippingAllowed,
      country: 'ES',
      language: 'es',
    },
  };

  if (weight) {
    event.attributes.shippingWeight = weight;
  }

  return event;
};
