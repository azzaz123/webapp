import { TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-payload-dtos.interface';
import { TransactionTrackingActionDetailPayloadBanner } from '../../../interfaces/transaction-tracking-action-detail.interface';

export class TransactionTrackingActionDetailPayloadBannerModel implements TransactionTrackingActionDetailPayloadBanner {
  title: string;
  trackingCode: string;

  constructor(carrierTrackingWebviewDto: TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto) {
    this.title = carrierTrackingWebviewDto.banner.title;
    this.trackingCode = carrierTrackingWebviewDto.banner.tracking_code;
  }
}
