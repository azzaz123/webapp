import {
  TransactionTrackingActionIconDto,
  TransactionTrackingStatusInfoDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';
import { TransactionTrackingActionDetail } from '../interfaces/transaction-tracking-action-detail.interface';
import { TransactionTrackingStatusInfo, TransactionTrackingStatusInfoIcon } from '../interfaces/transaction-tracking-status-info.interface';
import { TransactionTrackingActionDetailModel } from './action/detail/transaction-tracking-action-detail.model';
import { TransactionTrackingStatusInfoIconModel } from './status-info/transaction-tracking-status-info-icon.model';

export class TransactionTrackingStatusInfoModel implements TransactionTrackingStatusInfo {
  action: TransactionTrackingActionDetail;
  description: string;
  icon: TransactionTrackingStatusInfoIcon;
  showCaret: boolean;

  constructor(statusInfoDto: TransactionTrackingStatusInfoDto) {
    this.action = new TransactionTrackingActionDetailModel(statusInfoDto.action);
    this.description = statusInfoDto.description;
    this.icon = new TransactionTrackingStatusInfoIconModel(statusInfoDto.icon);
    this.showCaret = this.isShowCaret(statusInfoDto.action_icon);
  }

  private isShowCaret(actionIcon: TransactionTrackingActionIconDto): boolean {
    return actionIcon === 'caret';
  }
}
