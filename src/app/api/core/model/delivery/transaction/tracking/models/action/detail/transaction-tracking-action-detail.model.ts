import { TransactionTrackingActionDetailDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import { TransactionTrackingActionTypeDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/types/transaction-tracking-action-type-dto.type';
import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingActionDetailAnalytics,
  TransactionTrackingActionDetailPayload,
} from '../../../interfaces/transaction-tracking-action-detail.interface';
import { TransactionTrackingActionDetailAnalyticsModel } from './transaction-tracking-action-detail-analytics.model';

export class TransactionTrackingActionDetailModel implements TransactionTrackingActionDetail {
  analytics: TransactionTrackingActionDetailAnalytics;
  isCarrierTrackingWebview: boolean;
  isDeeplink: boolean;
  isDialog: boolean;
  isUserAction: boolean;
  payload: TransactionTrackingActionDetailPayload;

  constructor(actionDetailDto: TransactionTrackingActionDetailDto) {
    this.analytics = new TransactionTrackingActionDetailAnalyticsModel(actionDetailDto.analytics);
    this.isCarrierTrackingWebview = this.isActionType(actionDetailDto.action_type, 'carrier_tracking_webview');
    this.isDeeplink = this.isActionType(actionDetailDto.action_type, 'deeplink');
    this.isDialog = this.isActionType(actionDetailDto.action_type, 'dialog');
    this.isUserAction = this.isActionType(actionDetailDto.action_type, 'user_action');
    this.payload = null;
  }

  private isActionType(actionType: TransactionTrackingActionTypeDto, expectedActionType: TransactionTrackingActionTypeDto): boolean {
    return actionType === expectedActionType;
  }
}
