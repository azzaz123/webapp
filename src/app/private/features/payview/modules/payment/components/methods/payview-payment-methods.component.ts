import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { CreditCard } from '@api/core/model';
import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PayviewPaymentService } from '@private/features/payview/modules/payment/services/payview-payment.service';

@Component({
  selector: 'tsl-payview-payment-methods',
  templateUrl: './payview-payment-methods.component.html',
  styleUrls: ['./payview-payment-methods.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewPaymentMethodsComponent implements OnInit {
  @Input() public card: CreditCard;
  @Input() public defaultMethod: PaymentMethod;
  @Input() public methods: PaymentsPaymentMethod[];

  private selectedMethodIndex: number;

  constructor(private paymentService: PayviewPaymentService) {}

  public ngOnInit(): void {
    if (this.showMethods) {
      this.selectedMethodIndex = this.methods.findIndex((paymentMethod) => paymentMethod.method === this.defaultMethod);
    }
  }

  public editMethod(index: number): void {
    this.selectedMethodIndex = index;

    if (this.isCreditCard(this.methods[index])) {
      this.paymentService.editCreditCard();
      return;
    }
    // TODO - 18/03/2022 - Add others, like wallet or mix methods
  }

  public isCreditCard(paymentMethod: PaymentsPaymentMethod): boolean {
    return paymentMethod.method === PaymentMethod.CREDIT_CARD;
  }

  public isSelected(index: number): boolean {
    return this.selectedMethodIndex === index;
  }

  public selectMethod(index: number): void {
    this.selectedMethodIndex = index;
    this.paymentService.setPaymentMethod(this.methods[index]);
  }

  public get showMethods(): boolean {
    return !!this.methods && this.methods.length > 0;
  }

  public trackByIndex(index: number, name: PaymentsPaymentMethod): number {
    return index;
  }
}
