import { TransactionTrackingActionDetailDto } from './transaction-tracking-action-detail-dto.interface';

export type TransactionTrackingActionPayloadUserActionNameDto = 'PACKAGE_ARRIVED' | 'CANCEL_TRANSACTION' | 'EXPIRE_CLAIM_PERIOD';

export interface TransactionTrackingActionPayloadDeeplinkDto {
  link_url: string;
}

export interface TransactionTrackingActionPayloadUserActionDto {
  name: TransactionTrackingActionPayloadUserActionNameDto;
  parameters: {
    transaction_id: string;
  };
  on_success?: TransactionTrackingActionDetailDto;
}

export interface TransactionTrackingActionPayloadDialogDto {
  title_text: string;
  description_text: string;
  positive: {
    title: string;
    action: TransactionTrackingActionDetailDto;
  };
  negative: {
    title: string;
  };
}

export interface TransactionTrackingActionPayloadCarrierTrackingWebviewDto {
  title: string;
  banner: {
    title: string;
    tracking_code: string;
  };
  link_url: string;
}
