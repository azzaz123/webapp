import { TransactionTrackingExtraInfoDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingAdditionalInfo } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingAdditionalInfoModel implements TransactionTrackingAdditionalInfo {
  description: string;
  title: string;

  constructor(extraInfo: TransactionTrackingExtraInfoDto) {
    this.description = extraInfo.description;
    this.title = extraInfo.title;
  }
}
