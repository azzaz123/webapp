import {
  TransactionTrackingActionDto,
  TransactionTrackingBannerDto,
  TransactionTrackingExtraInfoDto,
  TransactionTrackingInstructionDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export interface TransactionTrackingInstructionsDto {
  navigation_title: string;
  title: string;
  banner: TransactionTrackingBannerDto;
  instructions: TransactionTrackingInstructionDto[];
  extra_info: TransactionTrackingExtraInfoDto;
  caption: string;
  actions: TransactionTrackingActionDto[];
}
