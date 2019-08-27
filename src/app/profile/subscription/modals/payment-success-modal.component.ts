import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-payment-success-modal',
  templateUrl: './payment-success-modal.component.html',
  styleUrls: ['./payment-success-modal.component.scss']
})

export class PaymentSuccessModalComponent {

  constructor(public activeModal: NgbActiveModal,
              private router: Router) {
  }

  public close() {
      this.activeModal.close();
      this.router.navigate(['profile/info']);
  }

}
