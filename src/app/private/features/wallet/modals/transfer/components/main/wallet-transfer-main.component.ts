import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { WALLET_PATHS } from '@private/features/wallet/wallet.routing.constants';
import { WalletTransferModalComponent } from '@private/features/wallet/modals/transfer/components/modal/wallet-transfer-modal.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-wallet-transfer-main',
  template: '',
})
export class WalletTransferMainComponent implements OnInit {
  public readonly WALLET_BALANCE_LINK = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BALANCE}`;

  constructor(private modalService: NgbModal, private router: Router) {}

  ngOnInit() {
    this.modalService
      .open(WalletTransferModalComponent, {
        windowClass: 'wallet-transfer',
      })
      .result.then(
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
