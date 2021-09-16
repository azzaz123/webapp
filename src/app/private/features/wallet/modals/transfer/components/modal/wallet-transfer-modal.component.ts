import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-wallet-transfer-modal',
  templateUrl: './wallet-transfer-modal.component.html',
  styleUrls: ['./wallet-transfer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransferModalComponent {
  constructor(public activeModal: NgbActiveModal) {}

  public closeModal(): void {
    this.activeModal.close();
  }
}
