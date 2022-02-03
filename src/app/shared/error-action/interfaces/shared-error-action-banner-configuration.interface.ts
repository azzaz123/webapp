import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';

export interface SharedErrorActionBannerConfigurationInterface extends BannerSpecifications {
  buttonText: string;
  description: string;
  iconPath: string;
  imagePath: string;
}
