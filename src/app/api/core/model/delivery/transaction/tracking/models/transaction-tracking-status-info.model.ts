import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionDetailModel,
  TransactionTrackingStatusInfo,
  TransactionTrackingStatusInfoIcon,
  TransactionTrackingStatusInfoIconModel,
} from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingActionIconDto,
  TransactionTrackingStatusInfoDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';

export class TransactionTrackingStatusInfoModel implements TransactionTrackingStatusInfo {
  action: TransactionTrackingActionDetail;
  description: string;
  icon: TransactionTrackingStatusInfoIcon;
  showCaret: boolean;

  constructor(statusInfoDto: TransactionTrackingStatusInfoDto) {
    this.action = !!statusInfoDto.action ? new TransactionTrackingActionDetailModel(statusInfoDto.action) : null;
    this.description = statusInfoDto.description;
    this.icon = new TransactionTrackingStatusInfoIconModel(statusInfoDto.icon);
    this.showCaret = this.isShowCaret(statusInfoDto.action_icon);
  }

  private isShowCaret(actionIcon: TransactionTrackingActionIconDto): boolean {
    return actionIcon === 'caret';
  }
}
