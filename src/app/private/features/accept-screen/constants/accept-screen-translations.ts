import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';

export const AcceptScreenDropOffPointTitle: Record<CARRIER_DROP_OFF_MODE, string> = {
  [CARRIER_DROP_OFF_MODE.HOME_PICK_UP]: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_title:Request a home pick up`,
  [CARRIER_DROP_OFF_MODE.POST_OFFICE]: $localize`:@@accept_view_seller_po_all_delivery_method_selector_title:Take it to a drop-off point`,
};

// TODO: check que hacer con la primera interpolación		Date: 2022/02/02
export const AcceptScreenDropOffPointInformation: Record<CARRIER_DROP_OFF_MODE, string> = {
  [CARRIER_DROP_OFF_MODE.HOME_PICK_UP]: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_pickup_date_description:The package will be picked up at your address on`,
  [CARRIER_DROP_OFF_MODE.POST_OFFICE]: $localize`:@@accept_view_seller_po_all_delivery_method_selector_time_limit_description:You have 5 days to drop off the package.`,
};

export const AcceptScreenDropOffPointSecondInformation: Record<CARRIER_DROP_OFF_MODE, string> = {
  [CARRIER_DROP_OFF_MODE.HOME_PICK_UP]: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_service_fee_description:The cost of the service will be deducted from your sale.`,
  [CARRIER_DROP_OFF_MODE.POST_OFFICE]: $localize`:@@accept_view_seller_po_all_delivery_method_selector_collection_point_address_description:Drop-off point:`,
};

export const AcceptScreenDropOffPointButtonTranslations: Record<CARRIER_DROP_OFF_MODE, string> = {
  [CARRIER_DROP_OFF_MODE.HOME_PICK_UP]: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_modify_pickup_date_button:Edit time slot`,
  [CARRIER_DROP_OFF_MODE.POST_OFFICE]: $localize`:@@accept_view_seller_po_all_delivery_method_selector_view_collection_points_button:View drop-off points`,
};

export const AcceptScreenDropOffPointFreePrice: Record<CARRIER_DROP_OFF_MODE, string> = {
  [CARRIER_DROP_OFF_MODE.HOME_PICK_UP]: $localize``,
  [CARRIER_DROP_OFF_MODE.POST_OFFICE]: $localize``,
};
