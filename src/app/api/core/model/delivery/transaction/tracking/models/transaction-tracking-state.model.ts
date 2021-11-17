import { TransactionTrackingActionStateDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/types/transaction-tracking-action-state-dto.type';
import { TransactionTrackingState } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingStateModel implements TransactionTrackingState {
  isDisabled: boolean;

  constructor(actionStateDto: TransactionTrackingActionStateDto) {
    this.isDisabled = actionStateDto === 'disabled';
  }
}
