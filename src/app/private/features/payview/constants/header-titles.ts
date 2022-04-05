import { PAYVIEW_STEPS } from '../enums/payview-steps.enum';

export const headerTitles: Record<PAYVIEW_STEPS, string> = {
  [PAYVIEW_STEPS.CREDIT_CARD]: $localize`:@@credit_card_form_top_bar_edit_title:Edit credit card`,
  [PAYVIEW_STEPS.DELIVERY_ADDRESS]: $localize`:@@address_view_all_users_top_bar_edit_title:Edit your address`,
  [PAYVIEW_STEPS.PAYVIEW]: $localize`:@@pay_view_buyer_top_bar_title:Make a purchase`,
  [PAYVIEW_STEPS.PICK_UP_POINT_MAP]: $localize`:@@map_view_all_users_po_all_top_bar_title:Pick a point`,
  [PAYVIEW_STEPS.PROMOTION_EDITOR]: $localize`:@@pay_view_buyer_top_bar_title:Make a purchase`,
};
