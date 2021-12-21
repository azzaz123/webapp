import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

export interface SharedErrorActionBannerConfigurationInterface extends NgbAlertConfig {
  buttonText: string;
  description: string;
  iconPath: string;
  imagePath: string;
}
