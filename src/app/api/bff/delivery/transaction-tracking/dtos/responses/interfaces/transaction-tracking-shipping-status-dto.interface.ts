import { TransactionTrackingActionDto } from './transaction-tracking-action-dto.interface';

export interface TransactionTrackingShippingStatusDto {
  actions: TransactionTrackingActionDto[];
  animation: TransactionTrackingAnimationDto;
  description: string;
  title: string;
}

export interface TransactionTrackingAnimationDto {
  mode: TransactionTrackingAnimationModeDto;
  url: string;
}
type TransactionTrackingAnimationModeDto = 'normal' | 'loop' | 'loop_reverse';
