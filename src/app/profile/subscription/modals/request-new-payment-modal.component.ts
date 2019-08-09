import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-request-new-payment-modal',
  templateUrl: './request-new-payment-modal.component.html'
})

export class RequestNewPaymentModalComponent {

  constructor(public activeModal: NgbActiveModal) {
  }

  public close() {
      this.activeModal.close();
  }

}
