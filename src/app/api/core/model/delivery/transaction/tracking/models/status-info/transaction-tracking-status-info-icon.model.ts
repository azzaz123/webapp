import { TransactionTrackingIconDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';
import { TransactionTrackingStatusInfoIcon } from '../../interfaces/transaction-tracking-status-info.interface';
import { TransactionTrackingStyle } from '../../interfaces/transaction-tracking-style.interface';
import { TransactionTrackingStatusInfoIconStyleModel } from './transaction-tracking-status-info-icon-style.model';

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
