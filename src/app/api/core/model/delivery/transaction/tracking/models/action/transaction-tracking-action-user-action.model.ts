import {
  TransactionTrackingActionAnalyticsModel,
  TransactionTrackingActionDetail,
  TransactionTrackingActionDetailAnalytics,
  TransactionTrackingActionDismissModel,
  TransactionTrackingActionFactory,
  TransactionTrackingActionUserAction,
} from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingActionDetailDto,
  TransactionTrackingActionDetailPayloadDto,
  TransactionTrackingActionDetailPayloadUserActionDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingActionUserActionModel implements TransactionTrackingActionUserAction {
  public analytics?: TransactionTrackingActionDetailAnalytics;
  public isUserAction: boolean = true;
  public name: string;
  public success: TransactionTrackingActionDetail;
  public transactionId: string;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
    this.name = this.getName(actionDetailDto.payload);
    this.success = this.getSuccess(actionDetailDto.payload);
    this.transactionId = this.getTransactionId(actionDetailDto.payload);
  }

  private getName(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    return (actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto).name ?? undefined;
  }

  private getSuccess(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): TransactionTrackingActionDetail {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto;
    return !!payload.on_success
      ? new TransactionTrackingActionFactory(payload.on_success).getAction()
      : new TransactionTrackingActionDismissModel(payload.on_success);
  }

  private getTransactionId(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto): string {
    const payload = actionDetailPayloadDto as TransactionTrackingActionDetailPayloadUserActionDto;
    return payload.parameters?.transaction_id ?? undefined;
  }
}
