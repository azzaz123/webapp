import {
  TransactionTracking,
  TransactionTrackingAnalytics,
  TransactionTrackingAnalyticsModel,
  TransactionTrackingHeader,
  TransactionTrackingHeaderModel,
  TransactionTrackingShippingStatus,
  TransactionTrackingShippingStatusModel,
  TransactionTrackingStatusInfo,
  TransactionTrackingStatusInfoModel,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingStatusInfoDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';

export class TransactionTrackingModel implements TransactionTracking {
  analytics: TransactionTrackingAnalytics;
  header: TransactionTrackingHeader;
  shippingStatus: TransactionTrackingShippingStatus;
  statusInfo: TransactionTrackingStatusInfo[];

  constructor(transactionDto: TransactionTrackingDto) {
    if (!!transactionDto.analytics) {
      this.analytics = new TransactionTrackingAnalyticsModel(transactionDto.analytics);
    }
    this.header = new TransactionTrackingHeaderModel(transactionDto.top_action, transactionDto.title);
    this.shippingStatus = new TransactionTrackingShippingStatusModel(transactionDto.shipping_status);
    this.statusInfo = this.getStatusInfos(transactionDto.transaction_status_info);
  }

  private getStatusInfos(transactionStatusInfoDto: TransactionTrackingStatusInfoDto[]): TransactionTrackingStatusInfo[] {
    let statusInfos: TransactionTrackingStatusInfo[] = [];
    transactionStatusInfoDto.forEach((statusInfoDto) => {
      statusInfos.push(new TransactionTrackingStatusInfoModel(statusInfoDto));
    });
    return statusInfos;
  }
}
