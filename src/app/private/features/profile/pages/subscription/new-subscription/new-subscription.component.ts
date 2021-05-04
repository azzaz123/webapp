import { Component, Input, OnInit } from '@angular/core';
import { ErrorsService } from '@core/errors/errors.service';
import { FinancialCard } from '@core/payments/payment.interface';
import { StripeService } from '@core/stripe/stripe.service';
import { SubscriptionResponse, SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-new-subscription',
  templateUrl: './new-subscription.component.html',
  styleUrls: ['./new-subscription.component.scss'],
})
export class NewSubscriptionComponent implements OnInit {
  @Input() subscription: SubscriptionsResponse;
  public stripeCards: FinancialCard[];
  constructor(private stripeService: StripeService, private errorService: ErrorsService) {}

  ngOnInit(): void {
    this.getAllCards();
  }

  private getAllCards(): void {
    this.stripeService.getCards(false).subscribe(
      (stripeCards: FinancialCard[]) => {
        this.stripeCards = stripeCards;
        console.log('TEST', stripeCards);
        // this.subscriptionStripeCards = stripeCards.filter((card) => card.invoices_default);
      },
      () => {
        this.errorService.i18nError('getStripeCardsError');
      }
    );
  }
}
