import { TransactionTrackingActionDetail } from '../../../interfaces/transaction-tracking-action-detail.interface';
import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import { TransactionTrackingActionDetailModel } from './transaction-tracking-action-detail.model';
import { TransactionTrackingActionDetailPayloadConfirmation } from '../../..';

export class TransactionTrackingActionDetailPayloadConfirmationModel implements TransactionTrackingActionDetailPayloadConfirmation {
  action: TransactionTrackingActionDetail;
  title: string;
  constructor(title: string, action?: TransactionTrackingActionDetailDto) {
    this.action = new TransactionTrackingActionDetailModel(action);
    this.title = title;
  }
}
