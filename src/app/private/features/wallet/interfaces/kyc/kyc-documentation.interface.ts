import { IOption } from '@shared/dropdown/utils/option.interface';
import { KYCTypeOfDocumentAnalytics } from '../../modals/kyc/services/kyc-tracking-events/kyc-tracking-events.type';

export interface KYCDocumentation extends IOption {
  imagesNeeded: KYCImagesNeeded;
  analyticsName: KYCTypeOfDocumentAnalytics;
}

export type KYCImagesNeeded = 1 | 2;
