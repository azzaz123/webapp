import { ClickActivateShipping, ClickBuy, ClickEditItemPrice, SaveItemPrice, SCREEN_IDS } from '@core/analytics/analytics-constants';

export const MOCK_TRACK_CLICK_BANNER_BUY_ATTRIBUTES: ClickBuy = {
  itemId: '5',
  categoryId: 1,
  screenId: SCREEN_IDS.Chat,
  itemPrice: 78,
};

export const MOCK_TRACK_CLICK_EDIT_ITEM_PRICE_ATTRIBUTES: ClickEditItemPrice = {
  itemId: '23483',
  categoryId: 4,
  itemPrice: 89,
  screenId: SCREEN_IDS.Chat,
};

export const MOCK_TRACK_CLICK_ACTIVATE_SHIPPING_ATTRIBUTES: ClickActivateShipping = {
  itemId: '22',
  categoryId: 3,
  itemPrice: 20,
  screenId: SCREEN_IDS.Chat,
};

export const MOCK_TRACK_SAVE_ITEM_PRICE_ATTRIBUTES: SaveItemPrice = {
  itemId: '383',
  categoryId: 2,
  itemPrice: 201,
  newItemPrice: 9,
  screenId: SCREEN_IDS.Chat,
};
