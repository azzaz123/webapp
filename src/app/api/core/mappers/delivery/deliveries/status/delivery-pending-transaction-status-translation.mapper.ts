import { DELIVERY_ONGOING_STATUS } from '@api/core/model/delivery/transaction/delivery-status/delivery-ongoing-status.enum';

const deliveryPendingTransactionBuyerTranslationsRelation: Record<DELIVERY_ONGOING_STATUS, string> = {
  [DELIVERY_ONGOING_STATUS.REQUEST_CREATED]: $localize`:@@purchases_view_buyer_all_all_request_created_ongoing_tab_shipping_status_label:Purchase made`,
  [DELIVERY_ONGOING_STATUS.TRANSACTION_CREATED]: $localize`:@@purchases_view_buyer_all_all_transaction_created_ongoing_tab_shipping_status_label:Purchase accepted`,
  [DELIVERY_ONGOING_STATUS.DELIVERED_TO_CARRIER]: $localize`:@@purchases_view_buyer_all_all_item_delivered_to_carrier_ongoing_tab_shipping_status_label:The courier company already has the package`,
  [DELIVERY_ONGOING_STATUS.IN_TRANSIT]: $localize`:@@purchases_view_buyer_all_all_in_transit_ongoing_tab_shipping_status_label:Package out for delivery`,
  [DELIVERY_ONGOING_STATUS.DELIVERED]: $localize`:@@purchases_view_buyer_all_all_item_delivered_ongoing_tab_shipping_status_label:Package received`,
  [DELIVERY_ONGOING_STATUS.ON_HOLD_AT_CARRIER]: $localize`:@@purchases_view_buyer_po_all_on_hold_at_carrier_ongoing_tab_shipping_status_label:Package on hold`,
  [DELIVERY_ONGOING_STATUS.ON_HOLD_INSTRUCTIONS_RECEIVED]: $localize`:@@purchases_view_buyer_po_all_on_hold_instructions_received_ongoing_tab_shipping_status_label:Reviewing the issue...`,
  [DELIVERY_ONGOING_STATUS.AVAILABLE_FOR_THE_RECIPIENT_CARRIER_OFFICE]: $localize`:@@purchases_view_buyer_all_po_item_available_for_the_recipient_ongoing_tab_shipping_status_label:Package ready to pick up`,
  [DELIVERY_ONGOING_STATUS.AVAILABLE_FOR_THE_RECIPIENT_HOME_PICKUP]: $localize`:@@purchases_view_buyer_hpu_ba_item_available_for_the_recipient_ongoing_tab_shipping_status_label:Package left at pick-up point`,
  [DELIVERY_ONGOING_STATUS.DELIVERY_PENDING_TO_RETRY]: $localize`:@@purchases_view_buyer_hpu_ba_delivery_pending_to_retry_ongoing_tab_shipping_status_label:Failed pickup attempt`,
  [DELIVERY_ONGOING_STATUS.PICKUP_PENDING_TO_RETRY]: $localize`:@@purchases_view_buyer_hpu_all_pending_to_retry_ongoing_tab_shipping_status_label:Failed pickup attempt`,
  [DELIVERY_ONGOING_STATUS.HOME_PICK_DELIVERY_FAILED]: $localize`:@@purchases_view_buyer_hpu_all_pending_to_retry_ongoing_tab_shipping_status_label:Failed pickup attempt`,
  [DELIVERY_ONGOING_STATUS.TRANSACTION_ERROR]: $localize`:@@purchases_view_buyer_all_all_shipping_failed_ongoing_tab_shipping_status_label:Shipment not completed`,
  [DELIVERY_ONGOING_STATUS.DISPUTE_OPEN]: $localize`:@@purchases_view_buyer_all_all_dispute_open_ongoing_tab_shipping_status_label:Dispute opened`,
  [DELIVERY_ONGOING_STATUS.DISPUTE_ACCEPTED]: $localize`:@@purchases_view_buyer_all_all_dispute_accepted_ongoing_tab_shipping_status_label:Dispute accepted`,
  [DELIVERY_ONGOING_STATUS.DISPUTE_ACCEPTED_BY_WALLAPOP]: $localize`:@@purchases_view_buyer_all_all_dispute_accepted_by_wallapop_ongoing_tab_shipping_status_label:Dispute accepted`,
  [DELIVERY_ONGOING_STATUS.DISPUTE_ESCALATED]: $localize`:@@purchases_view_buyer_all_all_dispute_escalated_ongoing_tab_shipping_status_label:Reviewing dispute…`,
  [DELIVERY_ONGOING_STATUS.TRANSACTION_DEFAULT]: '',
  [DELIVERY_ONGOING_STATUS.REQUEST_DEFAULT]: '',
};

const deliveryPendingTransactionSellerTranslationsRelation: Record<DELIVERY_ONGOING_STATUS, string> = {
  [DELIVERY_ONGOING_STATUS.REQUEST_CREATED]: '',
  [DELIVERY_ONGOING_STATUS.TRANSACTION_CREATED]: $localize`:@@sales_view_seller_all_all_transaction_created_ongoing_tab_shipping_status_label:Choose how to ship it`,
  [DELIVERY_ONGOING_STATUS.DELIVERED_TO_CARRIER]: $localize`:@@sales_view_seller_all_all_item_delivered_to_carrier_ongoing_tab_shipping_status_label:The courier company already has the package`,
  [DELIVERY_ONGOING_STATUS.IN_TRANSIT]: $localize`:@@sales_view_seller_all_all_in_transit_ongoing_tab_shipping_status_label:Package out for delivery`,
  [DELIVERY_ONGOING_STATUS.DELIVERED]: $localize`:@@sales_view_seller_all_all_item_delivered_ongoing_tab_shipping_status_label:The buyer has received the package`,
  [DELIVERY_ONGOING_STATUS.ON_HOLD_AT_CARRIER]: $localize`:@@sales_view_seller_po_all_on_hold_at_carrier_ongoing_tab_shipping_status_label:Package on hold`,
  [DELIVERY_ONGOING_STATUS.ON_HOLD_INSTRUCTIONS_RECEIVED]: $localize`:@@sales_view_seller_po_all_on_hold_instructions_received_ongoing_tab_shipping_status_label:Reviewing issue...`,
  [DELIVERY_ONGOING_STATUS.AVAILABLE_FOR_THE_RECIPIENT_CARRIER_OFFICE]: $localize`:@@sales_view_seller_hpu_all_item_available_for_the_recipient_ongoing_tab_shipping_status_label:Package at pick-up point`,
  [DELIVERY_ONGOING_STATUS.AVAILABLE_FOR_THE_RECIPIENT_HOME_PICKUP]: $localize`:@@sales_view_seller_po_all_item_available_for_the_recipient_ongoing_tab_shipping_status_label:The buyer can pick up the package`,
  [DELIVERY_ONGOING_STATUS.DELIVERY_PENDING_TO_RETRY]: $localize`:@@sales_view_seller_hpu_ba_delivery_pending_to_retry_ongoing_tab_shipping_status_label:Failed delivery attempt`,
  [DELIVERY_ONGOING_STATUS.PICKUP_PENDING_TO_RETRY]: $localize`:@@sales_view_seller_hpu_all_pending_to_retry_ongoing_tab_shipping_status_label:Failed pick-up attempt`,
  [DELIVERY_ONGOING_STATUS.HOME_PICK_DELIVERY_FAILED]: $localize`:@@sales_view_seller_hpu_all_pending_to_retry_ongoing_tab_shipping_status_label:Failed pick-up attempt`,
  [DELIVERY_ONGOING_STATUS.TRANSACTION_ERROR]: $localize`:@@sales_view_seller_all_all_shipping_failed_ongoing_tab_shipping_status_label:Shipment not completed`,
  [DELIVERY_ONGOING_STATUS.DISPUTE_OPEN]: $localize`:@@sales_view_seller_all_all_dispute_open_ongoing_tab_shipping_status_label:Dispute opened`,
  [DELIVERY_ONGOING_STATUS.DISPUTE_ACCEPTED]: $localize`:@@sales_view_seller_all_all_dispute_accepted_ongoing_tab_shipping_status_label:Dispute accepted`,
  [DELIVERY_ONGOING_STATUS.DISPUTE_ACCEPTED_BY_WALLAPOP]: $localize`:@@sales_view_seller_all_all_dispute_accepted_by_wallapop_ongoing_tab_shipping_status_label:Dispute accepted`,
  [DELIVERY_ONGOING_STATUS.DISPUTE_ESCALATED]: $localize`:@@sales_view_seller_all_all_dispute_escalated_ongoing_tab_shipping_status_label:Reviewing dispute…`,
  [DELIVERY_ONGOING_STATUS.TRANSACTION_DEFAULT]: '',
  [DELIVERY_ONGOING_STATUS.REQUEST_DEFAULT]: '',
};

export function mapDeliveryPendingTransactionStatusTranslation(
  statusName: DELIVERY_ONGOING_STATUS,
  isCurrentUserTheSeller: boolean
): string {
  if (isCurrentUserTheSeller) {
    return deliveryPendingTransactionSellerTranslationsRelation[statusName];
  }

  return deliveryPendingTransactionBuyerTranslationsRelation[statusName];
}
