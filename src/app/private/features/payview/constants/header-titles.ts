import { PAYVIEW_STEPS } from '../enums/payview-steps.enum';

export const headerTitles: Record<PAYVIEW_STEPS, string> = {
  [PAYVIEW_STEPS.CREDIT_CARD]: $localize`:@@delivery_add_credit_card_edit_mode_title:Edit credit card`,
  [PAYVIEW_STEPS.DELIVERY_ADDRESS]: $localize`:@@address_view_all_users_top_bar_edit_title:Edit your address`,
  [PAYVIEW_STEPS.PAYVIEW]: $localize`:@@pay_view_buyer_top_bar_title:Make a purchase`,
  [PAYVIEW_STEPS.PICK_UP_POINT_MAP]: $localize`:@@delivery_package_drop_selector_title:Select a point`,
  [PAYVIEW_STEPS.PROMOTION_EDITOR]: $localize`:@@pay_view_buyer_top_bar_title:Make a purchase`,
};
