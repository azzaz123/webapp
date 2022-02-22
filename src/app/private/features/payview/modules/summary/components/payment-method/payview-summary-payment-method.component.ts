import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CreditCard } from '@api/core/model';
import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentsUserPaymentPreference } from '@api/core/model/payments/interfaces/payments-user-payment-preference.interface';

const icons: Record<PaymentMethod, string> = {
  [PaymentMethod.CREDIT_CARD]: 'visa-mastercard.svg',
  [PaymentMethod.PAYPAL]: 'paypal.svg',
  [PaymentMethod.WALLET]: 'wallet.svg',
  [PaymentMethod.WALLET_AND_CREDIT_CARD]: 'wallet-card.svg',
  [PaymentMethod.WALLET_AND_PAYPAL]: 'wallet-paypal.svg',
};
const iconPath: string = './assets/icons/payview';

@Component({
  selector: 'tsl-payview-summary-payment-method',
  templateUrl: './payview-summary-payment-method.component.html',
  styleUrls: ['./payview-summary-payment-method.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewSummaryPaymentMethodComponent {
  @Input() public creditCard: CreditCard;
  @Input() public paymentMethod: PaymentsUserPaymentPreference;

  constructor() {}

  public get icon(): string {
    return `${iconPath}/${icons[this.paymentMethod.paymentMethod]}`;
  }

  public get isCreditCard(): boolean {
    return this.paymentMethod.paymentMethod === PaymentMethod.CREDIT_CARD;
  }

  public get isPayPal(): boolean {
    return this.paymentMethod.paymentMethod === PaymentMethod.PAYPAL;
  }

  public get creditCardLastFourDigits(): string {
    return this.creditCard?.lastFourDigits;
  }

  public get showPaymentMethod(): boolean {
    return !!this.paymentMethod;
  }
}
