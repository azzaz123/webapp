import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-payment-success-modal',
  templateUrl: './payment-success-modal.component.html',
  styleUrls: ['./payment-success-modal.component.scss']
})

export class PaymentSuccessModalComponent {

  constructor(public activeModal: NgbActiveModal) {
  }

  public close() {
      this.activeModal.close();
  }

}
