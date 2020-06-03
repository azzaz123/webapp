import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { NewCardModalComponent } from '../../modals/new-card-modal/new-card-modal.component';
import { FinancialCard } from '../credit-card-info/financial-card';
import { finalize } from 'rxjs/operators';
import { SubscriptionsService } from 'app/core/subscriptions/subscriptions.service';
import { SubscriptionsResponse } from 'app/core/subscriptions/subscriptions.interface';
import { ChangeCardModalComponent } from 'app/shared/modals/change-card-modal/change-card-modal.component';

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
    this.getAllCards();
  }

  public onDeleteCard(stripeCard: FinancialCard): void {
    this.getAllCards();
    /*if (this.stripeCards.length) {
      const index = this.stripeCards.indexOf(stripeCard);
      this.stripeCards.splice(index, 1);
    }*/
  }

  public addNewCard(): void {
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

  public addNewSubscriptionCard(): void {
    let modalRef: NgbModalRef = this.modalService.open(ChangeCardModalComponent, {windowClass: 'review'});
    modalRef.result.then((card: FinancialCard) => {
      this.loading = false;
      modalRef = null;
      this.getAllCards();
    },
    () => this.loading = false)
    .catch(() => this.loading = false)
  }

  public onSetChangeCard(event: any): void {
    this.addNewSubscriptionCard();
  }

  private getSubscriptions(): void {
    this.subscriptionsService.getSubscriptions(false)
      .subscribe(subscriptions => this.subscriptions = subscriptions);
  }

  private getAllCards(): void {
    this.stripeService.getCards(false).subscribe((stripeCards: FinancialCard[]) => {
      this.subscriptionStripeCards = stripeCards.filter( card => card.invoices_default);
      this.stripeCards = stripeCards.filter( card => !card.invoices_default);
    }, () => {
        this.errorService.i18nError('getStripeCardsError');
    });
  }
  
}
