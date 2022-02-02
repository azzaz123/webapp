import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';

export const AcceptScreenDropOffPointTitle: Record<CARRIER_DROP_OFF_MODE, string> = {
  [CARRIER_DROP_OFF_MODE.HOME_PICK_UP]: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_title:Request a home pick up`,
  [CARRIER_DROP_OFF_MODE.POST_OFFICE]: $localize`:@@accept_view_seller_po_all_delivery_method_selector_title:Take it to a drop-off point`,
};

export const AcceptScreenDropOffPointButtonTranslations: Record<CARRIER_DROP_OFF_MODE, string> = {
  [CARRIER_DROP_OFF_MODE.HOME_PICK_UP]: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_modify_pickup_date_button:Edit time slot`,
  [CARRIER_DROP_OFF_MODE.POST_OFFICE]: $localize`:@@accept_view_seller_po_all_delivery_method_selector_view_collection_points_button:View drop-off points`,
};

export const AcceptScreenDropOffPointFreePrice: Record<CARRIER_DROP_OFF_MODE, string> = {
  [CARRIER_DROP_OFF_MODE.HOME_PICK_UP]: '',
  [CARRIER_DROP_OFF_MODE.POST_OFFICE]: '',
};
