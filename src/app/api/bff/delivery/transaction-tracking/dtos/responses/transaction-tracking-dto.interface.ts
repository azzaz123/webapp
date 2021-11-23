import {
  TransactionTrackingActionDto,
  TransactionTrackingAnalyticsDto,
  TransactionTrackingShippingStatusDto,
  TransactionTrackingStatusInfoDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingDto {
  analytics?: TransactionTrackingAnalyticsDto;
  shipping_status: TransactionTrackingShippingStatusDto;
  title: string;
  top_action: TransactionTrackingActionDto;
  transaction_status_info: TransactionTrackingStatusInfoDto[];
}
