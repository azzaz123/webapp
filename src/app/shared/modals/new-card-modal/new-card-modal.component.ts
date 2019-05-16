import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentMethodResponse } from '../../../core/payments/payment.interface';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { EventService } from '../../../core/event/event.service';
import { FinancialCard } from '../../profile/credit-card-info/financial-card';

@Component({
  selector: 'tsl-new-card-modal',
  templateUrl: './new-card-modal.component.html',
  styleUrls: ['./new-card-modal.component.scss']
})
export class NewCardModalComponent {

  constructor(public activeModal: NgbActiveModal,
              private stripeService: StripeService,
              private errorService: ErrorsService,
              private eventService: EventService) {
    this.eventService.subscribe('createStripePaymentMethodResponse', (response: PaymentMethodResponse) => {
      const financialCard: FinancialCard = this.stripeService.mapResponse(response);
      this.addNewCard(financialCard);
    });
  }

private addNewCard(financialCard: FinancialCard) {
    this.stripeService.addNewCard(financialCard.id).subscribe((response: any) => {
      this.activeModal.close(financialCard)
    }, (error) => {
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('addNewCardError');
      }
    });
  }
  
}
