import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';

@Component({
  selector: 'tsl-stripe-cards',
  templateUrl: './stripe-cards.html',
  styleUrls: ['./stripe-cards.scss']
})
export class StripeCardsComponent implements OnInit {

  public stripeCards: FinancialCard[];

  constructor(private stripeService: StripeService,
              private modalService: NgbModal,
              private errorService: ErrorsService) { }

  ngOnInit() {
    this.stripeService.getCards().subscribe((stripeCards: FinancialCard[]) => {
      this.stripeCards = stripeCards;
    }, (error) => {
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('getStripeCardsError');
      }
    });
  }

  public onDeleteCard(stripeCard: FinancialCard): void {
    if (this.stripeCards.length) {
      const index = this.stripeCards.indexOf(stripeCard);
      this.stripeCards.splice(index, 1);
    }
  }

  public onSetFavoriteCard(stripeCard: FinancialCard): void {
    const index = this.stripeCards.indexOf(stripeCard);

    for (let i = 0; i < this.stripeCards.length; i++) {
      this.stripeCards[i].favorite = i === index ? true : false;
    }
  }

  public addNewCard(stripeCard: FinancialCard) {
    this.stripeService.addNewCard().subscribe((response: any) => {
      this.stripeCards.push(stripeCard);
    }, (error) => {
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('addNewCardError');
      }
    });
  }

}
