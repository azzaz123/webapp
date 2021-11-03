import {
  TransactionTrackingActionPayloadDeeplinkDto,
  TransactionTrackingActionPayloadUserActionDto,
  TransactionTrackingActionPayloadDialogDto,
  TransactionTrackingActionPayloadCarrierTrackingWebviewDto,
} from './interfaces/transaction-tracking-action-payload-dtos.interface';
import { TransactionTrackingActionTypeDto } from './types/transaction-tracking-action-type-dto.type';

export type TransactionTrackingActionPayloadDto =
  | TransactionTrackingActionPayloadDeeplinkDto
  | TransactionTrackingActionPayloadUserActionDto
  | TransactionTrackingActionPayloadDialogDto
  | TransactionTrackingActionPayloadCarrierTrackingWebviewDto;

export interface TransactionTrackingActionAnalyticsDto {
  request_id: string;
  source: string;
  user_id: string;
}

export interface TransactionTrackingActionDto {
  action_type: TransactionTrackingActionTypeDto;
  payload: TransactionTrackingActionPayloadDto;
  analytics: TransactionTrackingActionAnalyticsDto | null;
}
