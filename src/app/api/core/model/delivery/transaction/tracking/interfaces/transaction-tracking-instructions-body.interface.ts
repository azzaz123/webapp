import {
  TransactionTrackingAdditionalInfo,
  TransactionTrackingBanner,
  TransactionTrackingInstruction,
} from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingInstructionsBody {
  additionalInfo: TransactionTrackingAdditionalInfo;
  banner: TransactionTrackingBanner;
  instructions: TransactionTrackingInstruction[];
  title: string;
}
