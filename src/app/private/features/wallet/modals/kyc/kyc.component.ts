import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WALLET_PATHS } from '../../wallet.routing.constants';
import { KYCModalComponent } from './modals/kyc-modal/kyc-modal.component';

@Component({
  selector: 'tsl-kyc',
  templateUrl: './kyc.component.html',
})
export class KYCComponent implements OnInit {
  public readonly WALLET_BALANCE_LINK = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BALANCE}`;
  public readonly KYCModalOptions: NgbModalOptions = {
    windowClass: 'kyc',
    beforeDismiss: () => {
      return window.confirm(this.KYCModalCloseWarningCopy);
    },
  };
  private KYCModalCloseWarningCopy = $localize`:@@web_kyc_modal_close_warning:Are you sure you want to get out of the process? All information will be lost.`;

  constructor(private modalService: NgbModal, private router: Router) {}

  ngOnInit() {
    this.modalService.open(KYCModalComponent, this.KYCModalOptions).result.then(
      () => {
        this.navigateToWalletBalance();
      },
      () => {
        this.navigateToWalletBalance();
      }
    );
  }

  private navigateToWalletBalance(): void {
    this.router.navigate([this.WALLET_BALANCE_LINK]);
  }
}
