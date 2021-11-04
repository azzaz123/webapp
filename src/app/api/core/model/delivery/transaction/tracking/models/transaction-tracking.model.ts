import { TransactionTrackingDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTracking,
  TransactionTrackingShippingStatus,
  TransactionTrackingStatusInfo,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingAction } from '../interfaces/transaction-tracking-action.interface';
import { TransactionTrackingAnalytics } from '../interfaces/transaction-tracking-analytics.interface';
import { TransactionTrackingAnalyticsModel } from './transaction-tracking-analytics.model';

export class TransactionTrackingModel implements TransactionTracking {
  analytics: TransactionTrackingAnalytics;
  header: TransactionTrackingAction;
  shippingStatus: TransactionTrackingShippingStatus;
  statusInfo: TransactionTrackingStatusInfo[];
  title: string;

  constructor(transactionDto: TransactionTrackingDto) {
    this.analytics = new TransactionTrackingAnalyticsModel(transactionDto.analytics);
    this.header = new TransactionTrackingHeaderModel(transactionDto.top_action);
    this.shippingStatus = new TransactionTrackingShippingStatusModel(transactionDto.shipping_status);
    this.statusInfo = new TransactionTrackingStatusInfoModel(transactionDto.transaction_status_info);
    this.title = transactionDto.title;
  }
}
