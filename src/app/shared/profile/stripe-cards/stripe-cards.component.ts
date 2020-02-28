import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { NewCardModalComponent } from '../../modals/new-card-modal/new-card-modal.component';
import { FinancialCard } from '../credit-card-info/financial-card';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-stripe-cards',
  templateUrl: './stripe-cards.component.html',
  styleUrls: ['./stripe-cards.component.scss']
})
export class StripeCardsComponent implements OnInit {

  public loading = false;
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
    console.log('addNewCard')
    let modalRef: NgbModalRef = this.modalService.open(NewCardModalComponent, {windowClass: 'review'});
    modalRef.result.then((financialCard: FinancialCard) => {
      console.log('modal closed')
      this.loading = true;
      const existingCard = this.stripeCards.filter(stripeCard => stripeCard.id === financialCard.id);

      if (!existingCard.length) {
        console.log('does not exists, adding it')
        this.stripeService.addNewCard(financialCard.id)
          .pipe(finalize(() => this.loading = false))
          .subscribe(
            () => { this.stripeCards.push(financialCard); console.log('added new card')},
            () => this.errorService.i18nError('addNewCardError')
          );
      }
      modalRef = null;
    },
    () => this.loading = false)
    .catch(() => this.loading = false)
  }
  
}
