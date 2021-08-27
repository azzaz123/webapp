import { IOption } from '@shared/dropdown/utils/option.interface';

export interface KYCDocumentation extends IOption {
  imagesNeeded: KYCImagesNeeded;
}

export type KYCImagesNeeded = 1 | 2;
