import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionDetailAnalytics as TransactionTrackingActionAnalytics,
  TransactionTrackingActionAnalyticsModel,
  TransactionTrackingActionDetailPayload,
  TransactionTrackingActionDetailPayloadModel,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import { TransactionTrackingActionTypeDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/types/transaction-tracking-action-type-dto.type';

export class TransactionTrackingActionDetailModel implements TransactionTrackingActionDetail {
  analytics: TransactionTrackingActionAnalytics;
  isCarrierTrackingWebview: boolean;
  isDeeplink: boolean;
  isDialog: boolean;
  isDismiss: boolean;
  isReload: boolean;
  isUserAction: boolean;
  payload: TransactionTrackingActionDetailPayload;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    if (!!actionDetailDto.analytics) {
      this.analytics = new TransactionTrackingActionAnalyticsModel(actionDetailDto.analytics);
    }
    this.isCarrierTrackingWebview = this.isActionType(actionDetailDto.action_type, 'carrier_tracking_webview');
    this.isDeeplink = this.isActionType(actionDetailDto.action_type, 'deeplink');
    this.isDialog = this.isActionType(actionDetailDto.action_type, 'dialog');
    this.isDismiss = this.isActionType(actionDetailDto.action_type, 'dismiss');
    this.isReload = this.isActionType(actionDetailDto.action_type, 'reload');
    this.isUserAction = this.isActionType(actionDetailDto.action_type, 'user_action');
    this.payload = new TransactionTrackingActionDetailPayloadModel(actionDetailDto.payload);
  }

  private isActionType(actionType: TransactionTrackingActionTypeDto, expectedActionType: TransactionTrackingActionTypeDto): boolean {
    return actionType === expectedActionType;
  }
}
