import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';

@Component({
  selector: 'tsl-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent implements OnInit {

  @Input() financialCard: FinancialCard;

  constructor(private paymentService: PaymentService,
              private modalService: NgbModal,
              private stripeService: StripeService) { }

  ngOnInit() {
    this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
      this.financialCard = financialCard;
    });
  }

  public onDeleteCard(financialCard: FinancialCard): void {
    this.financialCard = null;
  }
}
