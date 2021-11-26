import {
  TransactionTrackingActionDetailDto,
  TransactionTrackingActionDetailPayloadUserActionNameDto,
  TransactionTrackingBannerDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingActionDetailPayloadDeeplinkDto {
  link_url: string;
}

export interface TransactionTrackingActionDetailPayloadUserActionDto {
  name: TransactionTrackingActionDetailPayloadUserActionNameDto;
  parameters: {
    transaction_id: string;
  };
  on_success?: TransactionTrackingActionDetailDto;
}

export interface TransactionTrackingActionDetailPayloadDialogDto {
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

export interface TransactionTrackingActionDetailPayloadCarrierTrackingWebviewDto {
  title: string;
  banner: TransactionTrackingBannerDto;
  link_url: string;
}
