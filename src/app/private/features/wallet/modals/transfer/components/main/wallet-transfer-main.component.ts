import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-wallet-transfer-main',
  templateUrl: './wallet-transfer-main.component.html',
  styleUrls: ['./wallet-transfer-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransferMainComponent {
  constructor(private activeModal: NgbActiveModal) {}

  public closeModal(): void {
    this.activeModal.close();
  }
}
