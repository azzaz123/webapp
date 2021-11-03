import { TransactionTrackingActionDto } from './interfaces/transaction-tracking-action-dto.interface';
import { TransactionTrackingAnalyticsDto } from './interfaces/transaction-tracking-analytics-dto.interface';
import { TransactionTrackingShippingStatusDto } from './interfaces/transaction-tracking-shipping-status-dto.interface';
import { TransactionTrackingStatusInfoDto } from './interfaces/transaction-tracking-status-info-dto.interface';

export interface TransactionTrackingDto {
  analytics?: TransactionTrackingAnalyticsDto;
  shipping_status: TransactionTrackingShippingStatusDto;
  title: string;
  top_action: TransactionTrackingActionDto;
  transaction_status_info: TransactionTrackingStatusInfoDto[];
}
