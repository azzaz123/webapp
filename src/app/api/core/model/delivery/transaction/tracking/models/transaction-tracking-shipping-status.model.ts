import {
  TransactionTrackingCta,
  TransactionTrackingActionModel,
  TransactionTrackingAnimation,
  TransactionTrackingShippingStatus,
  TransactionTrackingShippingStatusAnimationModel,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-dto.interface';
import { TransactionTrackingShippingStatusDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-shipping-status-dto.interface';

export class TransactionTrackingShippingStatusModel implements TransactionTrackingShippingStatus {
  actions: TransactionTrackingCta[];
  animation: TransactionTrackingAnimation;
  description: string;
  title: string;

  constructor(transactionTrackingShippingStatusDto: TransactionTrackingShippingStatusDto) {
    this.actions = this.getActions(transactionTrackingShippingStatusDto.actions);
    this.animation = new TransactionTrackingShippingStatusAnimationModel(transactionTrackingShippingStatusDto.animation);
    this.description = transactionTrackingShippingStatusDto.description;
    this.title = transactionTrackingShippingStatusDto.title;
  }

  private getActions(actions: TransactionTrackingActionDto[]): TransactionTrackingCta[] {
    let result: TransactionTrackingCta[] = [];
    actions.forEach((action) => {
      result.push(new TransactionTrackingActionModel(action));
    });
    return result;
  }
}
