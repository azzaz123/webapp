import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { NewCardModalComponent } from '../../modals/new-card-modal/new-card-modal.component';

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
    this.stripeService.getCards().subscribe((r: FinancialCard[]) => {
      console.log('stripe cards getcards ', r);
      this.stripeCards = r;
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

  public addNewCard() {
    const modalRef: NgbModalRef = this.modalService.open(NewCardModalComponent, {windowClass: 'review'});
    //modalRef.componentInstance.item = this.item;
    modalRef.result.then((card: FinancialCard) => this.stripeCards.push(card), () => {});
  }

}
