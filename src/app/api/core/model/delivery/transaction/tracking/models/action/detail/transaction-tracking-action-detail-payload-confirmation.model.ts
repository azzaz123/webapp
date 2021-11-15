import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionDetailModel,
  TransactionTrackingActionDetailPayloadConfirmation,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';

export class TransactionTrackingActionDetailPayloadConfirmationModel implements TransactionTrackingActionDetailPayloadConfirmation {
  action: TransactionTrackingActionDetail;
  title: string;
  constructor(title: string, action?: TransactionTrackingActionDetailDto) {
    if (!!action) {
      this.action = new TransactionTrackingActionDetailModel(action);
    }
    this.title = title;
  }
}
