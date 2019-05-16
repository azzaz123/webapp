import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { EventService } from '../../../core/event/event.service';

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
    this.eventService.subscribe('createStripePaymentMethodResponse', (response) => {
      console.log('modal ', response);
      this.addNewCard(response.paymentMethod.id);
    });
  }

private addNewCard(id: string) {
    this.stripeService.addNewCard(id).subscribe((response: any) => {
      console.log('add new card modal ', response);
      this.activeModal.close(response)
    }, (error) => {
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('addNewCardError');
      }
    });
  }
  
}
