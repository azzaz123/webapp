import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-wallet-transfer-modal',
  templateUrl: './wallet-transfer-modal.component.html',
  styleUrls: ['./wallet-transfer-modal.component.scss'],
})
export class WalletTransferModalComponent {
  constructor(private activeModal: NgbActiveModal) {}

  public closeModal(): void {
    this.activeModal.close();
  }
}
