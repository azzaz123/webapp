import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { NewCardModalComponent } from '../../modals/new-card-modal/new-card-modal.component';
import { FinancialCard } from '../credit-card-info/financial-card';
import * as _ from 'lodash';
import { PaymentMethodResponse, StripeCard, PaymentMethodCardResponse } from '../../../core/payments/payment.interface';

@Component({
  selector: 'tsl-stripe-cards',
  templateUrl: './stripe-cards.component.html',
  styleUrls: ['./stripe-cards.component.scss']
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

  /*public onSetFavoriteCard(stripeCard: FinancialCard): void {
    const index = this.stripeCards.indexOf(stripeCard);
    for (let i = 0; i < this.stripeCards.length; i++) {
      this.stripeCards[i].favorite = i === index ? true : false;
    }
  }*/

  public addNewCard() {
    let modalRef: NgbModalRef = this.modalService.open(NewCardModalComponent, {windowClass: 'review'});
    modalRef.result.then((financialCard: FinancialCard) => {
      const existingCard = this.stripeCards.filter((stripeCard: FinancialCard) => {
        return stripeCard.id === financialCard.id;
      });
      if (!existingCard.length) {
        this.stripeService.addNewCard(financialCard.id).subscribe((response: any) => {
          this.stripeCards.push(financialCard);
        }, () => {
          this.errorService.i18nError('addNewCardError');
        });
      }
      modalRef = null;
    }, () => {});
  }
  
}
