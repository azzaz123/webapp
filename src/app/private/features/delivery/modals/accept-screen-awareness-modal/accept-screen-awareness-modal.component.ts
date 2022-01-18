import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-accept-screen-awareness-modal',
  templateUrl: './accept-screen-awareness-modal.component.html',
  styleUrls: ['./accept-screen-awareness-modal.component.scss'],
})
export class AcceptScreenAwarenessModalComponent {
  public readonly ACCEPT_SCREEN_AWARENESS_LOTTIE =
    'https://prod-delivery-resources.s3.eu-west-1.amazonaws.com/transaction-tracking-screen/shipping_status_request_pending_buyer_animation.json';

  constructor(private activeModal: NgbActiveModal) {}

  public onClose(): void {
    this.activeModal.close();
  }
}
