import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-confirm-payment-modal',
  templateUrl: './confirm-payment-modal.component.html',
  styleUrls: ['./confirm-payment-modal.component.scss'],
})
export class ConfirmPaymentModalComponent {
  public readonly popOnBoardBuyImage: string = 'assets/images/confirm-payment-modal/pop-onboard-buy.svg';
  constructor(private activeModal: NgbActiveModal) {}

  public onClose(): void {
    this.activeModal.close();
  }
}
