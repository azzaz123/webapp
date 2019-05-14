import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss']
})
export class CreditCardInfoComponent implements OnInit {

  public financialCard: FinancialCard;
  public isStripe: boolean;
  @Input() card: FinancialCard;
  @Output() onDeleteCard: EventEmitter<FinancialCard> = new EventEmitter();
  @Output() onSetFavoriteCard: EventEmitter<FinancialCard> = new EventEmitter();


  constructor(private paymentService: PaymentService,
              private modalService: NgbModal,
              private stripeService: StripeService) { }

  ngOnInit() {
    if (this.card) {
      this.isStripe = true;
    } else {
      this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
        this.financialCard = financialCard;
      });
    }
  }

  deleteCreditCard() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt'
    });
    modalRef.componentInstance.type = 4;
    modalRef.result.then(() => {
      this.paymentService.deleteFinancialCard().subscribe(() => {
        this.financialCard = null;
      });
    }, () => {});
  }

  public setFavoriteCard(e: Event) {
    e.stopPropagation();
    this.stripeService.setFavoriteCard(this.card).subscribe(() => {
      this.onSetFavoriteCard.emit(this.card);
      //this.isFavorite = true;
    });
  }

  private removeCard() {
    this.stripeService.deleteCard().subscribe(() => {
      this.onDeleteCard.emit(this.card);
      this.card = null;
    });
  }

  public deleteStripeCard(e: Event) {
    e.stopPropagation();
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt'
    });
    modalRef.result.then(() => {
      this.removeCard();
    }, () => {});
  }

}
