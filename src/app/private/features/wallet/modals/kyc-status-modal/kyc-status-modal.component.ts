import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KYCAckService } from '@api/delivery/kyc-ack/kyc-ack.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WALLET_PATHS } from '../../wallet.routing.constants';
import { KYC_MODAL_STATUS } from '../kyc/enums/kyc-modal-status.enum';
import { KYCModalProperties } from '../kyc/interfaces/kyc-modal-properties.interface';

@Component({
  selector: 'tsl-kyc-status-modal',
  templateUrl: './kyc-status-modal.component.html',
  styleUrls: ['./kyc-status-modal.component.scss'],
})
export class KYCStatusModalComponent {
  public properties: KYCModalProperties;
  private readonly KYC_LINK = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BALANCE}/${WALLET_PATHS.KYC}`;

  constructor(public activeModal: NgbActiveModal, private router: Router, private kycAckService: KYCAckService) {}

  public closeModal(): void {
    this.activeModal.close();
  }

  public handleButtonClick(): void {
    if (this.properties.status === KYC_MODAL_STATUS.ERROR) {
      this.router.navigate([this.KYC_LINK]);
    }

    if (this.properties.status === KYC_MODAL_STATUS.SUCCEED) {
      this.kycAckService.notify().subscribe();
    }

    this.closeModal();
  }
}
