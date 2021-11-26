import {
  TransactionTrackingCta,
  TransactionTrackingActionDetail,
  TransactionTrackingActionFactory,
  TransactionTrackingActionStyleModel,
  TransactionTrackingState,
  TransactionTrackingStateModel,
  TransactionTrackingStyle,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-dto.interface';

export class TransactionTrackingCtaModel implements TransactionTrackingCta {
  action: TransactionTrackingActionDetail;
  state: TransactionTrackingState;
  style: TransactionTrackingStyle;
  title: string;

  constructor(actionDto: TransactionTrackingActionDto) {
    this.action = new TransactionTrackingActionFactory(actionDto.action).getAction();
    this.state = new TransactionTrackingStateModel(actionDto.state);
    this.style = new TransactionTrackingActionStyleModel(actionDto.style);
    this.title = actionDto.title;
  }
}
