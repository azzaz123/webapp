import { ONGOING_TRANSACTION_TRACKING_STATUS } from '@api/core/model/delivery/transaction/status';

export const ongoingTransactionTrackingStatusAsBuyerTranslations: Record<ONGOING_TRANSACTION_TRACKING_STATUS, string> = {
  [ONGOING_TRANSACTION_TRACKING_STATUS.REQUEST_CREATED]: $localize`:@@purchases_view_buyer_all_all_request_created_ongoing_tab_shipping_status_label:Purchase made`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.TRANSACTION_CREATED]: $localize`:@@purchases_view_buyer_all_all_transaction_created_ongoing_tab_shipping_status_label:Purchase accepted`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.ITEM_DELIVERED_TO_CARRIER]: $localize`:@@purchases_view_buyer_all_all_item_delivered_to_carrier_ongoing_tab_shipping_status_label:The courier company already has the package`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.IN_TRANSIT]: $localize`:@@purchases_view_buyer_all_all_in_transit_ongoing_tab_shipping_status_label:Package out for delivery`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.ON_HOLD_AT_CARRIER]: $localize`:@@purchases_view_buyer_po_all_on_hold_at_carrier_ongoing_tab_shipping_status_label:Package on hold`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.ON_HOLD_INSTRUCTIONS_RECEIVED]: $localize`:@@purchases_view_buyer_po_all_on_hold_instructions_received_ongoing_tab_shipping_status_label:Reviewing the issue...`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.ITEM_AVAILABLE_FOR_THE_RECIPIENT]: $localize`:@@purchases_view_buyer_all_po_item_available_for_the_recipient_ongoing_tab_shipping_status_label:Package ready to pick up!`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.ITEM_DELIVERED]: $localize`:@@purchases_view_buyer_all_all_item_delivered_ongoing_tab_shipping_status_label:Package received`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.SHIPPING_FAILED]: $localize`:@@purchases_view_buyer_all_all_shipping_failed_ongoing_tab_shipping_status_label:Shipment not completed`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.DISPUTE_OPEN]: $localize`:@@purchases_view_buyer_all_all_dispute_open_ongoing_tab_shipping_status_label:Dispute opened`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.DISPUTE_ACCEPTED]: $localize`:@@purchases_view_buyer_all_all_dispute_accepted_ongoing_tab_shipping_status_label:Dispute accepted`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.DISPUTE_ESCALATED]: $localize`:@@purchases_view_buyer_all_all_dispute_escalated_ongoing_tab_shipping_status_label:Reviewing dispute…`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.DISPUTE_ACCEPTED_BY_WALLAPOP]: $localize`:@@purchases_view_buyer_all_all_dispute_accepted_by_wallapop_ongoing_tab_shipping_status_label:Dispute accepted`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.PENDING_TO_RETRY_HPU]: $localize`:@@purchases_view_buyer_hpu_all_pending_to_retry_ongoing_tab_shipping_status_label:Failed pickup attempt`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.DELIVERY_PENDING_TO_RETRY_HPU]: $localize`:@@purchases_view_buyer_hpu_ba_delivery_pending_to_retry_ongoing_tab_shipping_status_label:Failed pickup attempt`,
  [ONGOING_TRANSACTION_TRACKING_STATUS.ITEM_AVAILABLE_FOR_THE_RECIPIENT_HPU]: $localize`:@@purchases_view_buyer_hpu_ba_item_available_for_the_recipient_ongoing_tab_shipping_status_label:Package left at pick-up point`,
};
