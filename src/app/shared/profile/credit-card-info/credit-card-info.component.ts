import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from './financial-card';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss']
})
export class CreditCardInfoComponent {
  
  @Input() financialCard: FinancialCard;
  @Output() onDeleteCard: EventEmitter<FinancialCard> = new EventEmitter();
  @Output() onDeleteStripeCard: EventEmitter<FinancialCard> = new EventEmitter();

  constructor(private modalService: NgbModal,
              private stripeService: StripeService) { }

  public deleteStripeCard(e: Event) {
    e.stopPropagation();
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt'
    });
    modalRef.componentInstance.type = 4;
    modalRef.result.then(() => {
      this.stripeService.deleteCard(this.financialCard.id).subscribe(() => {
        this.onDeleteStripeCard.emit(this.financialCard);
        this.financialCard = null;
      });
    }, () => {});
  }

}
