import { TransactionTrackingActionDetailPayloadDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-dto.interface';
import {
  TransactionTrackingActionDetail,
  TransactionTrackingActionDetailPayload,
  TransactionTrackingActionDetailPayloadBanner,
  TransactionTrackingActionDetailPayloadConfirmation,
  TransactionTrackingActionDetailPayloadParameters,
} from '../../../interfaces/transaction-tracking-action-detail.interface';

export class TransactionTrackingActionDetailPayloadModel implements TransactionTrackingActionDetailPayload {
  banner: TransactionTrackingActionDetailPayloadBanner;
  description: string;
  linkUrl: string;
  name: string;
  negative: TransactionTrackingActionDetailPayloadConfirmation;
  parameters: TransactionTrackingActionDetailPayloadParameters;
  positive: TransactionTrackingActionDetailPayloadConfirmation;
  success: TransactionTrackingActionDetail;
  title: string;

  constructor(actionDetailPayloadDto: TransactionTrackingActionDetailPayloadDto) {
    this.banner = new TransactionTrackingActionDetailPayloadBannerModel(actionDetailPayloadDto.banner);
  }
}
