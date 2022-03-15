import {
  ClickAcceptOffer,
  ClickAddEditAddress,
  ClickHelpTransactional,
  ClickItemCard,
  ClickOtherProfile,
  ClickRejectOffer,
  ClickScheduleHPU,
  ViewAcceptOffer,
} from '@core/analytics/analytics-constants';
import {
  MOCK_ACCEPT_SCREEN_PROPERTIES,
  MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU,
  MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS,
  MOCK_ACCEPT_SCREEN_SELLER,
} from './accept-screen-properties.fixtures.spec';

export const MOCK_CLICK_ITEM_CARD_EVENT_PROPERTIES: Partial<ClickItemCard> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.itemId,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES.item.categoryId,
  title: MOCK_ACCEPT_SCREEN_PROPERTIES.item.title,
  salePrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.itemPrice.amount.total,
  isPro: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.isPro,
  isCarDealer: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.isCarDealer,
  sellerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.id,
  sellerRating: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.rating,
};

export const MOCK_CLICK_OTHER_PROFILE_EVENT_PROPERTIES: Partial<ClickOtherProfile> = {
  isPro: MOCK_ACCEPT_SCREEN_SELLER.isPro,
  sellerUserId: MOCK_ACCEPT_SCREEN_SELLER.id,
};

export const MOCK_CLICK_HELP_TRANSACTIONAL_EVENT_PROPERTIES: Partial<ClickHelpTransactional> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.itemId,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES.item.categoryId,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.itemPrice.amount.total,
  sellerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.id,
  helpName: 'Help Top Accept Screen',
};

export const MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU: Partial<ViewAcceptOffer> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.itemId,
  buyerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.buyer.id,
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.id,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.item.categoryId,
  isPro: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.seller.isPro,
  totalPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.sellerRevenue.totalPrice.amount.total,
  offeredPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.offeredPrice.amount.total,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.sellerRevenue.itemPrice.amount.total,
  title: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.item.title,
  method: 'HPU',
  buyerCountry: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.buyer.countryISOCode,
};

export const MOCK_VIEW_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_PO: Partial<ViewAcceptOffer> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.itemId,
  buyerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.buyer.id,
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.id,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES.item.categoryId,
  isPro: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.isPro,
  totalPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.totalPrice.amount.total,
  offeredPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.offeredPrice.amount.total,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.itemPrice.amount.total,
  title: MOCK_ACCEPT_SCREEN_PROPERTIES.item.title,
  method: 'correos',
  buyerCountry: MOCK_ACCEPT_SCREEN_PROPERTIES.buyer.countryISOCode,
};

export const MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITH_FULL_ADDRESS_AND_PO: Partial<ClickAddEditAddress> = {
  addOrEdit: 'edit',
  addressType: 'office',
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.id,
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.itemId,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.itemPrice.amount.total,
};

export const MOCK_CLICK_ADD_EDIT_ADDRESS_EVENT_PROPERTIES_WITHOUT_FULL_ADDRESS_AND_HPU: Partial<ClickAddEditAddress> = {
  addOrEdit: 'add',
  addressType: 'home',
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS.request.id,
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS.request.itemId,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS.request.sellerRevenue.itemPrice.amount.total,
};

export const MOCK_CLICK_SCHEDULE_HPU_EVENT_PROPERTIES: Partial<ClickScheduleHPU> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.itemId,
  buyerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES.buyer.id,
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.id,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES.item.categoryId,
  totalPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.totalPrice.amount.total,
  offeredPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.offeredPrice.amount.total,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.itemPrice.amount.total,
  title: MOCK_ACCEPT_SCREEN_PROPERTIES.item.title,
};

export const MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_PO: Partial<ClickAcceptOffer> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.itemId,
  buyerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES.buyer.id,
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.id,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES.item.categoryId,
  isPro: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.isPro,
  totalPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.totalPrice.amount.total,
  offeredPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.offeredPrice.amount.total,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.itemPrice.amount.total,
  title: MOCK_ACCEPT_SCREEN_PROPERTIES.item.title,
  method: 'correos',
};

export const MOCK_CLICK_ACCEPT_OFFER_EVENT_PROPERTIES_WITH_HPU: Partial<ClickAcceptOffer> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.itemId,
  buyerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.buyer.id,
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.id,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.item.categoryId,
  isPro: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.seller.isPro,
  totalPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.sellerRevenue.totalPrice.amount.total,
  offeredPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.offeredPrice.amount.total,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.sellerRevenue.itemPrice.amount.total,
  title: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.item.title,
  method: 'HPU',
};

export const MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_PO: Partial<ClickRejectOffer> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.itemId,
  buyerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES.buyer.id,
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES.request.id,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES.item.categoryId,
  isPro: MOCK_ACCEPT_SCREEN_PROPERTIES.seller.isPro,
  totalPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.totalPrice.amount.total,
  offeredPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.offeredPrice.amount.total,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES.request.sellerRevenue.itemPrice.amount.total,
  title: MOCK_ACCEPT_SCREEN_PROPERTIES.item.title,
  method: 'correos',
};

export const MOCK_CLICK_REJECT_OFFER_EVENT_PROPERTIES_WITH_HPU: Partial<ClickRejectOffer> = {
  itemId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.itemId,
  buyerUserId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.buyer.id,
  requestId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.id,
  categoryId: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.item.categoryId,
  isPro: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.seller.isPro,
  totalPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.sellerRevenue.totalPrice.amount.total,
  offeredPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.offeredPrice.amount.total,
  itemPrice: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.request.sellerRevenue.itemPrice.amount.total,
  title: MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.item.title,
  method: 'HPU',
};
