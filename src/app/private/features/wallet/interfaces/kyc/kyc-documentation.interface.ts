import { IOption } from '@shared/dropdown/utils/option.interface';

export interface KYCDocumentation extends IOption {
  photosNeeded: 1 | 2;
}
