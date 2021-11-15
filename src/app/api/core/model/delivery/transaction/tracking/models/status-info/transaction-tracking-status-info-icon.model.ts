import {
  TransactionTrackingStatusInfoIcon,
  TransactionTrackingStatusInfoIconStyleModel,
  TransactionTrackingStyle,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingIconDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';

export class TransactionTrackingStatusInfoIconModel implements TransactionTrackingStatusInfoIcon {
  url: string;
  thumbnailUrl: string;
  style: TransactionTrackingStyle;

  constructor(iconDto: TransactionTrackingIconDto) {
    this.url = iconDto.url;
    this.thumbnailUrl = iconDto.thumbnail_url;
    this.style = new TransactionTrackingStatusInfoIconStyleModel(iconDto.style);
  }
}
