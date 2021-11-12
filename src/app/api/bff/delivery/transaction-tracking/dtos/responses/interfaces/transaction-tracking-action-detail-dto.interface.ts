import { TransactionTrackingActionTypeDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/types/transaction-tracking-action-type-dto.type';
import {
  TransactionTrackingActionDetailPayloadDeeplinkDto,
  TransactionTrackingActionDetailPayloadUserActionDto,
  TransactionTrackingActionDetailPayloadDialogDto,
  TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export type TransactionTrackingActionDetailPayloadDto =
  | TransactionTrackingActionDetailPayloadDeeplinkDto
  | TransactionTrackingActionDetailPayloadUserActionDto
  | TransactionTrackingActionDetailPayloadDialogDto
  | TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto
  | {};

export interface TransactionTrackingActionDetailAnalyticsDto {
  request_id: string;
  source: string;
  user_id: string;
}

export interface TransactionTrackingActionDetailDto {
  action_type: TransactionTrackingActionTypeDto;
  analytics: TransactionTrackingActionDetailAnalyticsDto | null;
  payload?: TransactionTrackingActionDetailPayloadDto;
}
