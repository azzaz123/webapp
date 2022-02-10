import { ACCEPT_SCREEN_STEPS } from './accept-screen-steps';

export const ACCEPT_SCREEN_DELIVERY_ADDRESS = {
  ADD: $localize`:@@address_view_all_users_top_bar_add_title:Add your address`,
  EDIT: $localize`:@@address_view_all_users_top_bar_edit_title:Edit your address`,
};

export const ACCEPT_SCREEN_HEADER_TRANSLATIONS: Record<ACCEPT_SCREEN_STEPS, string> = {
  [ACCEPT_SCREEN_STEPS.ACCEPT_SCREEN]: $localize`:@@accept_view_seller_top_bar_buy_flow_test_variant_b_title:Ship the product`,
  [ACCEPT_SCREEN_STEPS.DELIVERY_ADDRESS]: ACCEPT_SCREEN_DELIVERY_ADDRESS.ADD,
  [ACCEPT_SCREEN_STEPS.SCHEDULE]: $localize`:@@time_slot_view_seller_hpu_ba_top_bar_title:Pickup date and time`,
  [ACCEPT_SCREEN_STEPS.MAP]: $localize`:@@map_view_all_users_po_all_top_bar_title:Pick a point`,
};
