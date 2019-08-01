import { Component, OnInit, Input } from '@angular/core';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';

@Component({
  selector: 'tsl-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent implements OnInit {

  @Input() financialCard: FinancialCard;

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
      this.financialCard = financialCard;
    });
  }

  public onDeleteCard(): void {
    this.financialCard = null;
  }
}
