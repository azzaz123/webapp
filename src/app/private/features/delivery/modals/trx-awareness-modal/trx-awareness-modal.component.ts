import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-trx-awareness-modal',
  templateUrl: './trx-awareness-modal.component.html',
  styleUrls: ['./trx-awareness-modal.component.scss'],
})
export class TRXAwarenessModalComponent {
  public readonly TRX_AWARENESS_LOTTIE =
    'https://prod-delivery-resources.s3.eu-west-1.amazonaws.com/transaction-tracking-screen/shipping_status_in_transit_animation.json';

  constructor(private activeModal: NgbActiveModal) {}

  public onClose(): void {
    this.activeModal.close();
  }
}
