import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCBannerSpecifications } from '../../interfaces/kyc/kyc-banner.interface';

@Component({
  selector: 'tsl-kyc-banner',
  templateUrl: './kyc-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KycBannerComponent {
  @Input() KYCBannerSpecifications: KYCBannerSpecifications;

  get buttonClassName(): string {
    return `btn-white btn-white--${this.KYCBannerSpecifications.type}`;
  }

  get ngbAlertConfiguration(): NgbAlertConfig {
    return {
      dismissible: this.KYCBannerSpecifications.dismissible,
      type: this.KYCBannerSpecifications.type,
    };
  }
}