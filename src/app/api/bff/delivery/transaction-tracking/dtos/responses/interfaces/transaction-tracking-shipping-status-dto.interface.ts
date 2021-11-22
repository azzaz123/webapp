import { TransactionTrackingActionDto, TransactionTrackingExtraInfoDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingShippingStatusDto extends TransactionTrackingExtraInfoDto {
  actions: TransactionTrackingActionDto[];
  animation: TransactionTrackingAnimationDto;
}

export interface TransactionTrackingAnimationDto {
  mode: TransactionTrackingAnimationModeDto;
  url: string;
}
export type TransactionTrackingAnimationModeDto = 'normal' | 'loop' | 'loop_reverse';
