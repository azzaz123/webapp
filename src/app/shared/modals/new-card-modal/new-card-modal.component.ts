import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentMethodResponse } from '../../../core/payments/payment.interface';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from '@shared/credit-card-info/financial-card';

@Component({
  selector: 'tsl-new-card-modal',
  templateUrl: './new-card-modal.component.html',
  styleUrls: ['./new-card-modal.component.scss'],
})
export class NewCardModalComponent {
  public loading: boolean;

  constructor(public activeModal: NgbActiveModal, private stripeService: StripeService) {}

  public onCreateCard(paymentMethod: PaymentMethodResponse) {
    const financialCard: FinancialCard = this.stripeService.mapResponse(paymentMethod);
    this.activeModal.close(financialCard);
  }
}
