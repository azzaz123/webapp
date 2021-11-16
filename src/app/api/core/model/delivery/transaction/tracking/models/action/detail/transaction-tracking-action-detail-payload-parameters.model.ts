import { TransactionTrackingActionDetailPayloadParameters } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailPayloadUserActionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-payload-dtos.interface';

export class TransactionTrackingActionDetailPayloadParametersModel implements TransactionTrackingActionDetailPayloadParameters {
  transactionId: string;

  constructor(userActionDto: TransactionTrackingActionDetailPayloadUserActionDto) {
    this.transactionId = userActionDto.parameters.transaction_id;
  }
}
