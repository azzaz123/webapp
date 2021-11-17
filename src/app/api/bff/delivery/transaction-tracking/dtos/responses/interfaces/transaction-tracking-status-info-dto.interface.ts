import {
  TransactionTrackingActionDetailDto,
  TransactionTrackingInstructionDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingStatusInfoDto extends TransactionTrackingInstructionDto {
  action_icon: TransactionTrackingActionIconDto;
  icon: TransactionTrackingIconDto;
}

export interface TransactionTrackingIconDto {
  style: TransactionTrackingIconStyleDto;
  thumbnail_url: string;
  url: string;
}

export type TransactionTrackingActionIconDto = 'caret' | 'none';
export type TransactionTrackingIconStyleDto = 'rounded' | 'circle' | 'none';
