import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { NewCardModalComponent } from '../../modals/new-card-modal/new-card-modal.component';
import { FinancialCard } from '../credit-card-info/financial-card';
import { finalize } from 'rxjs/operators';
import { SubscriptionsService } from 'app/core/subscriptions/subscriptions.service';
import { SubscriptionsResponse } from 'app/core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-stripe-cards',
  templateUrl: './stripe-cards.component.html',
  styleUrls: ['./stripe-cards.component.scss']
})
export class StripeCardsComponent implements OnInit {

  public loading = false;
  public stripeCards: FinancialCard[];
  public subscriptionStripeCards: FinancialCard[];
  public subscriptions: SubscriptionsResponse[];

  constructor(private stripeService: StripeService,
              private modalService: NgbModal,
              private errorService: ErrorsService,
              private subscriptionsService: SubscriptionsService) { }

  ngOnInit() {
    this.getSubscriptions();
    this.stripeService.getCards().subscribe((stripeCards: FinancialCard[]) => {
      this.subscriptionStripeCards = stripeCards.filter( card => card.invoices_default);
      this.stripeCards = stripeCards.filter( card => !card.invoices_default);
    }, () => {
        this.errorService.i18nError('getStripeCardsError');
    });
  }

  public onDeleteCard(stripeCard: FinancialCard): void {
    if (this.stripeCards.length) {
      const index = this.stripeCards.indexOf(stripeCard);
      this.stripeCards.splice(index, 1);
    }
  }

  public addNewCard() {
    let modalRef: NgbModalRef = this.modalService.open(NewCardModalComponent, {windowClass: 'review'});
    modalRef.result.then((financialCard: FinancialCard) => {
      this.loading = true;
      const existingCard = this.stripeCards.filter(stripeCard => stripeCard.id === financialCard.id);

      if (!existingCard.length) {
        this.stripeService.addNewCard(financialCard.id)
          .pipe(finalize(() => this.loading = false))
          .subscribe(
            () => this.stripeCards.push(financialCard),
            () => this.errorService.i18nError('addNewCardError')
          );
      }
      modalRef = null;
    },
    () => this.loading = false)
    .catch(() => this.loading = false)
  }

  public onSetDefaultCard(stripeCard: FinancialCard): void {
    const existingCard = this.stripeCards.filter(stripeCard => stripeCard.id === stripeCard.id);
    if (!existingCard.length) {
      this.stripeCards.push(stripeCard);
    }
  }

  private filterSubscriptionCard(stripeCards: FinancialCard[]) {
    this.subscriptionStripeCards = stripeCards.filter( card => card.invoices_default);
  }

  private getSubscriptions() {
    this.subscriptionsService.getSubscriptions(false)
      .subscribe(subscriptions => this.subscriptions = subscriptions);
  }
  
}
