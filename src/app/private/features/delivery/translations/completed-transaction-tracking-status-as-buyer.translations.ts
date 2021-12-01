import { COMPLETED_TRANSACTION_TRACKING_STATUS } from '@api/core/model/delivery/transaction/status';

export const completedTransactionTrackingStatusAsBuyerTranslations = (
  status: COMPLETED_TRANSACTION_TRACKING_STATUS,
  interpolation: string
): string => {
  const translations: Record<COMPLETED_TRANSACTION_TRACKING_STATUS, string> = {
    [COMPLETED_TRANSACTION_TRACKING_STATUS.DISPUTE_REJECTED_BY_WALLAPOP]: $localize`:@@purchases_view_buyer_all_all_dispute_rejected_by_wallapop_finished_tab_shipping_status_label:Dispute rejected on ${interpolation}:INTERPOLATION`,
    [COMPLETED_TRANSACTION_TRACKING_STATUS.DISPUTE_CLOSED]: $localize`:@@purchases_view_buyer_all_all_dispute_closed_finished_tab_shipping_status_label:Dispute closed on ${interpolation}:INTERPOLATION`,
    [COMPLETED_TRANSACTION_TRACKING_STATUS.DISPUTE_EXPIRED]: $localize`:@@purchases_view_buyer_all_all_dispute_expired_finished_tab_shipping_status_label:Dispute expired on ${interpolation}:INTERPOLATION`,
    [COMPLETED_TRANSACTION_TRACKING_STATUS.TRANSACTION_CANCELLED_BY_SELLER]: $localize`:@@purchases_view_buyer_all_all_transaction_cancelled_by_seller_finished_tab_shipping_status_label:Cancelled on ${interpolation}:INTERPOLATION`,
    [COMPLETED_TRANSACTION_TRACKING_STATUS.TRANSACTION_EXPIRED]: $localize`:@@purchases_view_buyer_all_all_transaction_expired_finished_tab_shipping_status_label:Cancelled on ${interpolation}:INTERPOLATION`,
    [COMPLETED_TRANSACTION_TRACKING_STATUS.TRANSACTION_CANCELLED]: $localize`:@@purchases_view_buyer_all_all_transaction_cancelled_finished_tab_shipping_status_label:Cancelled on %1$S`,
    [COMPLETED_TRANSACTION_TRACKING_STATUS.MONEY_TRANSFERRED]: $localize`:@@purchases_view_buyer_all_all_money_transferred_finished_tab_shipping_status_label:Completed on ${interpolation}:INTERPOLATION`,
  };

  return translations[status];
};
