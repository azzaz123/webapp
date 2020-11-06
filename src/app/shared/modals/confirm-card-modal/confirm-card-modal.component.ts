import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeCard } from 'app/core/payments/payment.interface';

@Component({
  selector: 'tsl-confirm-card-modal',
  templateUrl: './confirm-card-modal.component.html',
  styleUrls: ['./confirm-card-modal.component.scss'],
})
export class ConfirmCardModalComponent {
  public financialCard: StripeCard;

  constructor(public activeModal: NgbActiveModal) {}

  public confirmChange() {
    this.activeModal.close('changeCardModal');
  }
}
