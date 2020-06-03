import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from './financial-card';
import { finalize } from 'rxjs/operators';
import { NewCardModalComponent } from 'app/shared/modals/new-card-modal/new-card-modal.component';
import { ErrorsService } from 'app/core/errors/errors.service';
import { ChangeCardModalComponent } from 'app/shared/modals/change-card-modal/change-card-modal.component';
import { PaymentMethodCardResponse } from 'app/core/payments/payment.interface';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss']
})
export class CreditCardInfoComponent {
  public loading = false;
  
  @Input() financialCard: FinancialCard;
  @Output() onSetChangeCard: EventEmitter<Event> = new EventEmitter();
  @Output() onDeleteStripeCard: EventEmitter<FinancialCard> = new EventEmitter();

  constructor(private modalService: NgbModal,
              private stripeService: StripeService,
              private errorService: ErrorsService) { }

  public deleteStripeCard(e: Event) {
    e.stopPropagation();
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt'
    });
    modalRef.componentInstance.type = 4;
    //show text in the modal stating that he won't be able to renew his subscriptions
    modalRef.componentInstance.financialCard = this.financialCard;//invoices_default
    modalRef.result.then(() => {
      this.loading = true;
      this.stripeService.deleteCard(this.financialCard.id).pipe(finalize(() => this.loading = false)).subscribe(() => {
        this.onDeleteStripeCard.emit(this.financialCard);
        this.financialCard = null;
      });
    }, () => {});
  }

  public changeStripeCard(e: Event) {
    this.onSetChangeCard.emit(e);
  }

}
