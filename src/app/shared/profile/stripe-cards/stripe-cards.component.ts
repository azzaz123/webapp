import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { NewCardModalComponent } from '../../modals/new-card-modal/new-card-modal.component';
import { FinancialCard } from '../credit-card-info/financial-card';

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
      const existingCard = this.stripeCards.filter((stripeCard: FinancialCard) => {
        return stripeCard.id === financialCard.id;
      });
      if (!existingCard.length) {
        this.stripeService.addNewCard(financialCard.id).subscribe(() => {
          this.stripeCards.push(financialCard);
        }, () => {
          this.errorService.i18nError('addNewCardError');
        });
      }
      modalRef = null;
    }, () => {});
  }
  
}