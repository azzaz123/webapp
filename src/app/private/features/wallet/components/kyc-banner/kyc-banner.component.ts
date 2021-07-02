import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { KYCBannerSpecifications } from '../../interfaces/kyc/kyc-banner.interface';

@Component({
  selector: 'tsl-kyc-banner',
  templateUrl: './kyc-banner.component.html',
  styleUrls: ['./kyc-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KycBannerComponent {
  @Input() specifications: KYCBannerSpecifications;

  get bannerSpecifications(): NgbAlertConfig {
    return {
      dismissible: this.specifications.dismissible,
      type: this.specifications.type,
    };
  }
}
