import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from './financial-card';
import { finalize } from 'rxjs/operators';
import { NoCardModalComponent } from 'app/shared/modals/no-card-modal/no-card-modal.component';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss'],
})
export class CreditCardInfoComponent {
  public loading = false;

  @Input() financialCard: FinancialCard;
  @Output() onSetChangeCard: EventEmitter<Event> = new EventEmitter();
  @Output() onDeleteStripeCard: EventEmitter<
    FinancialCard
  > = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private stripeService: StripeService
  ) {}

  public checkDelete(e: Event) {
    e.stopPropagation();
    if (this.financialCard.invoices_default) {
      let modalRef: NgbModalRef = this.modalService.open(NoCardModalComponent, {
        windowClass: 'review',
      });
      modalRef.result.then((action: string) => {
        modalRef = null;
        if (action === 'deleteCardModal') {
          this.stripeService
            .deleteCard(this.financialCard.id)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(() => {
              this.onDeleteStripeCard.emit(this.financialCard);
              this.financialCard = null;
            });
        }
      });
    } else {
      this.deleteStripeCard();
    }
  }

  public deleteStripeCard() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt',
    });
    modalRef.componentInstance.type = 4;
    modalRef.componentInstance.financialCard = this.financialCard;
    modalRef.result.then(
      () => {
        this.loading = true;
        this.stripeService
          .deleteCard(this.financialCard.id)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe(() => {
            this.onDeleteStripeCard.emit(this.financialCard);
            this.financialCard = null;
            this.loading = false;
          });
      },
      () => {}
    );
  }

  public changeStripeCard(e: Event) {
    this.onSetChangeCard.emit(e);
  }
}
