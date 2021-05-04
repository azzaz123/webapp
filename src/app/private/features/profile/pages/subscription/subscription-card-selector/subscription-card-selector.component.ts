import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionResponse } from '@core/subscriptions/subscriptions.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChangeCardModalComponent } from '@shared/modals/change-card-modal/change-card-modal.component';
import { NewCardModalComponent } from '@shared/modals/new-card-modal/new-card-modal.component';
import { FinancialCard } from '@shared/profile/credit-card-info/financial-card';

export const test = 'AAAA';

@Component({
  selector: 'tsl-subscription-card-selector',
  templateUrl: './subscription-card-selector.component.html',
  styleUrls: ['./subscription-card-selector.component.scss'],
})
export class SubscriptionCardSelectorComponent implements OnInit {
  @Input() stripeCards: FinancialCard[];
  loading;

  selectedCard;

  constructor(private modalService: NgbModal) {}

  test = test;

  ngOnInit(): void {
    console.log('stripe', this.stripeCards);
    this.selectedCard = this.stripeCards.find((card) => card.invoices_default) || this.stripeCards[0];
  }

  onSetChangeCard(event) {}

  public addNewCard(): void {
    let modalRef: NgbModalRef = this.modalService.open(NewCardModalComponent, {
      windowClass: 'review',
    });
    modalRef.result
      .then(
        (financialCard: FinancialCard) => {
          this.loading = true;
          console.log('test', financialCard);
          const existingCard = this.stripeCards.filter((stripeCard) => stripeCard.id === financialCard.id);
          this.selectedCard = financialCard;

          /*           if (!existingCard.length) {
            this.stripeService
              .addNewCard(financialCard.id)
              .pipe(finalize(() => (this.loading = false)))
              .subscribe(
                () => this.stripeCards.push(financialCard),
                () => this.errorService.i18nError('addNewCardError')
              );
          } */
          modalRef = null;
        },
        () => (this.loading = false)
      )
      .catch(() => (this.loading = false));
  }

  public addNewSubscriptionCard(): void {
    let modalRef: NgbModalRef = this.modalService.open(ChangeCardModalComponent, { windowClass: 'review' });
    modalRef.componentInstance.isNewSubscription = true;
    modalRef.result
      .then(
        (card) => {
          this.selectedCard = card;
        },
        () => (this.loading = false)
      )
      .catch(() => {
        this.loading = false;
      });
  }
}
