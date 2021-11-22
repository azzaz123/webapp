import { TransactionTrackingBannerDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingBanner } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingBannerModel implements TransactionTrackingBanner {
  title: string;
  trackingCode: string;

  constructor(bannerDto: TransactionTrackingBannerDto) {
    this.title = bannerDto.title;
    this.trackingCode = bannerDto.tracking_code;
  }
}
