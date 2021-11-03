import { TransactionTrackingActionDto } from './transaction-tracking-action-dto.interface';
import { TransactionTrackingActionStateDto } from './types/transaction-tracking-action-state-dto.type';
import { TransactionTrackingActionStyleDto } from './types/transaction-tracking-action-style-dto.type';

export interface TransactionTrackingDto {
  analytics?: {
    buyer_country: string;
    seller_country: string;
  };
  shipping_status: {
    actions: {
      action: TransactionTrackingActionDto;
      state: TransactionTrackingActionStateDto;
      style: TransactionTrackingActionStyleDto;
      title: string;
    }[];
    animation: {
      mode: string;
      url: string;
    };
    description: string;
    title: string;
  };
  title: string;
  top_action: {
    action: TransactionTrackingActionDto;
    state: TransactionTrackingActionStateDto;
    style: TransactionTrackingActionStyleDto;
    title: string;
  };
  transaction_status_info: {
    action: TransactionTrackingActionDto;
    action_icon: string;
    description: string;
    icon: {
      style: string;
      thumbnail_url: string;
      url: string;
    };
  }[];
}
