import { TransactionTrackingShippingStatusDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-shipping-status-dto.interface';
import { TransactionTrackingAction } from '../interfaces/transaction-tracking-action.interface';
import { TransactionTrackingAnimation } from '../interfaces/transaction-tracking-animation.interface';
import { TransactionTrackingShippingStatus } from '../interfaces/transaction-tracking-shipping-status.interface';
import { TransactionTrackingActionModel } from './action/transaction-tracking-action.model';
import { TransactionTrackingShippingStatusAnimationModel } from './shipping-status/transaction-tracking-shipping-status-animation.model';

export class TransactionTrackingShippingStatusModel implements TransactionTrackingShippingStatus {
  actions: TransactionTrackingAction[];
  animation: TransactionTrackingAnimation;
  description: string;
  title: string;

  constructor(private transactionTrackingShippingStatusDto: TransactionTrackingShippingStatusDto) {
    this.actions = this.getActions();
    this.animation = new TransactionTrackingShippingStatusAnimationModel(transactionTrackingShippingStatusDto.animation);
    this.description = transactionTrackingShippingStatusDto.description;
    this.title = transactionTrackingShippingStatusDto.title;
  }

  private getActions(): TransactionTrackingAction[] {
    let actions: TransactionTrackingAction[] = [];
    this.transactionTrackingShippingStatusDto.actions.forEach((action) => {
      actions.push(new TransactionTrackingActionModel(action));
    });
    return actions;
  }
}
