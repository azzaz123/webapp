import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCBannerInterface } from '../../interfaces/kyc/kyc-banner.interface';

@Component({
  selector: 'tsl-kyc-banner',
  templateUrl: './kyc-banner.component.html',
  styleUrls: ['./kyc-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KycBannerComponent {
  @Input() KYCBannerSpecifications: KYCBannerInterface;

  get bannerSpecifications(): NgbAlertConfig {
    return {
      dismissible: this.KYCBannerSpecifications.dismissible,
      type: this.KYCBannerSpecifications.type,
    };
  }
}
