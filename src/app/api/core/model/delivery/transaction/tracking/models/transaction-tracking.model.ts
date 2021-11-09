import { TransactionTrackingDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingStatusInfoDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';
import {
  TransactionTracking,
  TransactionTrackingShippingStatus,
  TransactionTrackingStatusInfo,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingAction } from '../interfaces/transaction-tracking-action.interface';
import { TransactionTrackingAnalytics } from '../interfaces/transaction-tracking-analytics.interface';
import { TransactionTrackingActionModel } from './action/transaction-tracking-action.model';
import { TransactionTrackingAnalyticsModel } from './transaction-tracking-analytics.model';
import { TransactionTrackingShippingStatusModel } from './transaction-tracking-shipping-status.model';
import { TransactionTrackingStatusInfoModel } from './transaction-tracking-status-info.model';

export class TransactionTrackingModel implements TransactionTracking {
  analytics: TransactionTrackingAnalytics;
  header: TransactionTrackingAction;
  navigationTitle: string;
  shippingStatus: TransactionTrackingShippingStatus;
  statusInfo: TransactionTrackingStatusInfo[];
  title: string;

  constructor(transactionDto: TransactionTrackingDto) {
    if (!!transactionDto.analytics) {
      this.analytics = new TransactionTrackingAnalyticsModel(transactionDto.analytics);
    }
    this.header = new TransactionTrackingActionModel(transactionDto.top_action);
    this.shippingStatus = new TransactionTrackingShippingStatusModel(transactionDto.shipping_status);
    this.statusInfo = this.getStatusInfos(transactionDto.transaction_status_info);
    this.title = transactionDto.title;
  }

  private getStatusInfos(transactionStatusInfoDto: TransactionTrackingStatusInfoDto[]): TransactionTrackingStatusInfo[] {
    let statusInfos: TransactionTrackingStatusInfo[] = [];
    transactionStatusInfoDto.forEach((statusInfoDto) => {
      statusInfos.push(new TransactionTrackingStatusInfoModel(statusInfoDto));
    });
    return statusInfos;
  }
}
