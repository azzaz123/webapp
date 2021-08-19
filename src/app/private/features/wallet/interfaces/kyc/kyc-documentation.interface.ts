import { IOption } from '@shared/dropdown/utils/option.interface';

export interface KYCDocumentation extends IOption {
  photosNeeded: KYCPhotosNeeded;
}

export type KYCPhotosNeeded = 1 | 2;
