import { TransactionTrackingActionDetailDto } from './transaction-tracking-action-detail-dto.interface';

export interface TransactionTrackingStatusInfoDto {
  action: TransactionTrackingActionDetailDto;
  action_icon: TransactionTrackingActionIconDto;
  description: string;
  icon: TransactionTrackingIconDto;
}

export interface TransactionTrackingIconDto {
  style: TransactionTrackingIconStyleDto;
  thumbnail_url: string;
  url: string;
}

export type TransactionTrackingActionIconDto = 'caret' | 'none';
export type TransactionTrackingIconStyleDto = 'rounded' | 'circle' | 'none';
