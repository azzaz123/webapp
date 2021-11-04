import { TransactionTrackingActionDetail } from '../../../interfaces/transaction-tracking-action-detail.interface';
import { TransactionTrackingActionDetailModel } from './transaction-tracking-action-detail.model';
import { TransactionTrackingActionDetailPayloadConfirmation } from '../../..';
import { TransactionTrackingActionDetailPayloadDialogDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-payload-dtos.interface';

export class TransactionTrackingActionDetailPayloadConfirmationModel implements TransactionTrackingActionDetailPayloadConfirmation {
  action: TransactionTrackingActionDetail;
  title: string;
  constructor(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDialogDto) {
    this.action = new TransactionTrackingActionDetailModel(actionDetailPayloadDto.positive.action);
    this.title = actionDetailPayloadDto.positive?.title || actionDetailPayloadDto.negative?.title;
  }
}
