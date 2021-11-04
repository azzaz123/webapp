import { TransactionTrackingActionTypeDto } from '../types/transaction-tracking-action-type-dto.type';
import {
  TransactionTrackingActionDetailPayloadDeeplinkDto,
  TransactionTrackingActionDetailPayloadUserActionDto,
  TransactionTrackingActionDetailPayloadDialogDto,
  TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto,
} from './transaction-tracking-action-detail-payload-dtos.interface';

export type TransactionTrackingActionDetailPayloadDto =
  | TransactionTrackingActionDetailPayloadDeeplinkDto
  | TransactionTrackingActionDetailPayloadUserActionDto
  | TransactionTrackingActionDetailPayloadDialogDto
  | TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto;

export interface TransactionTrackingActionDetailAnalyticsDto {
  request_id: string;
  source: string;
  user_id: string;
}

export interface TransactionTrackingActionDetailDto {
  action_type: TransactionTrackingActionTypeDto;
  payload: TransactionTrackingActionDetailPayloadDto;
  analytics: TransactionTrackingActionDetailAnalyticsDto | null;
}
