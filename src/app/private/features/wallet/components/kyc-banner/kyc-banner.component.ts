import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/kyc-banner-specifications.interface';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { NgbAlertConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KYCInfoModalComponent } from '../../modals/kyc-info-modal/kyc-info-modal.component';
import { KYCStatusModalComponent } from '../../modals/kyc-status-modal/kyc-status-modal.component';
import { KYC_MODAL_STATUS_PROPERTIES } from '../../modals/kyc/constants/kyc-modal-status-constants';
import { KYC_MODAL_STATUS_TYPE } from '../../modals/kyc/enums/kyc-modal-status-type-enum';
import { KYCModalStatus } from '../../modals/kyc/interfaces/kyc-modal-status.interface';

@Component({
  selector: 'tsl-kyc-banner',
  templateUrl: './kyc-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCBannerComponent {
  @Input() KYCBannerSpecifications: KYCBannerSpecifications;
  constructor(private modalService: NgbModal) {}

  public openModal(): void {
    if (this.KYCBannerSpecifications.status === KYC_STATUS.PENDING) {
      this.openKYCInformativeSliderModal();
    } else {
      this.openKYCStatusModal();
    }
  }

  private openKYCInformativeSliderModal(): void {
    this.modalService.open(KYCInfoModalComponent).result.then(() => {});
  }

  private openKYCStatusModal(): void {
    let modalRef: NgbModalRef = this.modalService.open(KYCStatusModalComponent);
    modalRef.componentInstance.properties = this.KYCStatusProperties;

    modalRef.result.then(() => {});
  }

  public get buttonClassName(): string {
    return `btn-white btn-white--${this.KYCBannerSpecifications.type}`;
  }

  public get ngbAlertConfiguration(): NgbAlertConfig {
    return {
      dismissible: this.KYCBannerSpecifications.dismissible,
      type: this.KYCBannerSpecifications.type,
    };
  }

  private get KYCStatusProperties(): KYCModalStatus {
    const KYCBannerStatus: KYC_STATUS = this.KYCBannerSpecifications.status;

    if (KYCBannerStatus === KYC_STATUS.PENDING_VERIFICATION) {
      return KYC_MODAL_STATUS_PROPERTIES.find((property) => property.status === KYC_MODAL_STATUS_TYPE.IN_PROGRESS);
    }
    if (KYCBannerStatus === KYC_STATUS.VERIFIED) {
      return KYC_MODAL_STATUS_PROPERTIES.find((property) => property.status === KYC_MODAL_STATUS_TYPE.SUCCEED);
    }
    if (KYCBannerStatus === KYC_STATUS.REJECTED) {
      return KYC_MODAL_STATUS_PROPERTIES.find((property) => property.status === KYC_MODAL_STATUS_TYPE.ERROR);
    }
  }
}
