import { TransactionTrackingActionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-dto.interface';
import { TransactionTrackingActionDetail } from '../../interfaces/transaction-tracking-action-detail.interface';
import { TransactionTrackingAction } from '../../interfaces/transaction-tracking-action.interface';
import { TransactionTrackingActionStyleModel } from './transaction-tracking-action-style.model';
import { TransactionTrackingState } from '../../interfaces/transaction-tracking-state.interface';
import { TransactionTrackingStyle } from '../../interfaces/transaction-tracking-style.interface';
import { TransactionTrackingStateModel } from '../transaction-tracking-state.model';
import { TransactionTrackingActionDetailModel } from './detail/transaction-tracking-action-detail.model';

export class TransactionTrackingActionModel implements TransactionTrackingAction {
  action: TransactionTrackingActionDetail;
  state: TransactionTrackingState;
  style: TransactionTrackingStyle;
  title: string;

  constructor(actionDto: TransactionTrackingActionDto) {
    this.action = new TransactionTrackingActionDetailModel(actionDto.action);
    this.state = new TransactionTrackingStateModel(actionDto.state);
    this.style = new TransactionTrackingActionStyleModel(actionDto.style);
    this.title = actionDto.title;
  }
}
