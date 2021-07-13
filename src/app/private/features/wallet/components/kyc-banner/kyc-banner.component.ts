import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KYCBannerSpecifications } from '../../interfaces/kyc/kyc-banner.interface';
import { KYCInfoModalComponent } from '../../modals/kyc-info-modal/kyc-info-modal.component';

@Component({
  selector: 'tsl-kyc-banner',
  templateUrl: './kyc-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCBannerComponent {
  @Input() KYCBannerSpecifications: KYCBannerSpecifications;
  constructor(private modalService: NgbModal) {}

  public openKYCSlider(): void {
    this.modalService.open(KYCInfoModalComponent).result.then(() => {});
  }

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
