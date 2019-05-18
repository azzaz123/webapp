import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentMethodResponse } from '../../../core/payments/payment.interface';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { FinancialCard } from '../../profile/credit-card-info/financial-card';

@Component({
  selector: 'tsl-new-card-modal',
  templateUrl: './new-card-modal.component.html',
  styleUrls: ['./new-card-modal.component.scss']
})
export class NewCardModalComponent {

  public loading: boolean;

  constructor(public activeModal: NgbActiveModal,
              private stripeService: StripeService,
              private errorService: ErrorsService) {
  }

  public onCreateCard(paymentMethod: PaymentMethodResponse) {
    const financialCard: FinancialCard = this.stripeService.mapResponse(paymentMethod);
    this.activeModal.close(financialCard);
  }

  /*private addNewCard(financialCard: FinancialCard) {
    this.loading = true;
    this.stripeService.addNewCard(financialCard.id).subscribe((response: any) => {
      console.log('close new card ', response);
      this.loading = false;
      this.activeModal.close(financialCard);
    }, (error) => {
      console.log('error nueva tarjeta');
      this.loading = false;
      this.activeModal.close('error');
      this.errorService.i18nError('addNewCardError');
    });
  }*/
  
}
