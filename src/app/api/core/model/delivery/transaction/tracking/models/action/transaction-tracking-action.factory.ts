import {
  TransactionTrackingActionCarrierTrackingWebviewModel,
  TransactionTrackingActionDeeplinkModel,
  TransactionTrackingActionDetail,
  TransactionTrackingActionDialogModel,
  TransactionTrackingActionDismissModel,
  TransactionTrackingActionUserActionModel,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import { TransactionTrackingActionTypeDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/types/transaction-tracking-action-type-dto.type';

export class TransactionTrackingActionFactory {
  private action: TransactionTrackingActionDetailDto;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    this.action = actionDetailDto;
  }

  public getAction(): TransactionTrackingActionDetail {
    const actions: Record<TransactionTrackingActionTypeDto, TransactionTrackingActionDetail> = {
      carrier_tracking_webview: new TransactionTrackingActionCarrierTrackingWebviewModel(this.action),
      deeplink: new TransactionTrackingActionDeeplinkModel(this.action),
      dialog: new TransactionTrackingActionDialogModel(this.action),
      dismiss: new TransactionTrackingActionDismissModel(this.action),
      user_action: new TransactionTrackingActionUserActionModel(this.action),
    };
    return actions[this.action.action_type];
  }
}
