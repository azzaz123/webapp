import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BannerSpecifications } from '@shared/banner/banner-specifications.interface';
import { KYCInfoModalComponent } from '../../modals/kyc-info-modal/kyc-info-modal.component';
import { KYCStatusModalComponent } from '../../modals/kyc-status-modal/kyc-status-modal.component';
import { KYC_MODAL_STATUS_PROPERTIES } from '../../modals/kyc/constants/kyc-modal-status-constants';
import { KYC_MODAL_STATUS } from '../../modals/kyc/enums/kyc-modal-status.enum';
import { KYCModalProperties } from '../../modals/kyc/interfaces/kyc-modal-properties.interface';

@Component({
  selector: 'tsl-kyc-banner',
  templateUrl: './kyc-banner.component.html',
  styleUrls: ['./kyc-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCBannerComponent {
  @Input() KYCBannerSpecifications: KYCBannerSpecifications;
  @Input() KYCProperties: KYCProperties;

  constructor(private modalService: NgbModal) {}

  public openModal(): void {
    if (this.KYCBannerSpecifications.status === KYC_STATUS.PENDING) {
      this.openKYCInformativeModal();
    } else {
      this.openKYCStatusModal();
    }
  }

  public get buttonClassName(): string {
    return `btn-white btn-white--medium-fontsize btn-white--${this.KYCBannerSpecifications.type}`;
  }

  public get bannerSpecifications(): BannerSpecifications {
    return {
      dismissible: this.KYCBannerSpecifications.dismissible,
      type: this.KYCBannerSpecifications.type,
    };
  }

  private get KYCModalProperties(): KYCModalProperties {
    const KYCBannerStatus: KYC_STATUS = this.KYCBannerSpecifications.status;

    if (KYCBannerStatus === KYC_STATUS.PENDING_VERIFICATION) {
      return this.getStatusProperty(KYC_MODAL_STATUS.IN_PROGRESS);
    }
    if (KYCBannerStatus === KYC_STATUS.VERIFIED) {
      return this.getStatusProperty(KYC_MODAL_STATUS.SUCCEED);
    }
    if (KYCBannerStatus === KYC_STATUS.REJECTED) {
      const modalProperties: KYCModalProperties = this.getStatusProperty(KYC_MODAL_STATUS.ERROR);
      modalProperties.description = this.KYCProperties.refusedReason?.translation;

      return modalProperties;
    }
  }

  private getStatusProperty(status: KYC_MODAL_STATUS): KYCModalProperties {
    return KYC_MODAL_STATUS_PROPERTIES.find((property: KYCModalProperties) => property.status === status);
  }

  private openKYCStatusModal(): void {
    let modalRef: NgbModalRef = this.modalService.open(KYCStatusModalComponent);
    modalRef.componentInstance.properties = this.KYCModalProperties;

    modalRef.result.then(
      () => {},
      () => {}
    );
  }

  private openKYCInformativeModal(): void {
    this.modalService.open(KYCInfoModalComponent).result.then(
      () => {},
      () => {}
    );
  }
}
