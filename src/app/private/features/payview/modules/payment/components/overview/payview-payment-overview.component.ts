import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CreditCard } from '@api/core/model';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';

@Component({
  selector: 'tsl-payview-payment-overview',
  templateUrl: './payview-payment-overview.component.html',
  styleUrls: ['./payview-payment-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewPaymentOverviewComponent {
  @Input() public card: CreditCard;
  @Input() public methods: PaymentsPaymentMethods;
  @Input() public preferences: PaymentsUserPaymentPreferences;

  public get defaultPaymentMethod(): PAYVIEW_PAYMENT_METHOD {
    return this.preferences?.preferences?.paymentMethod ?? this.preferences?.defaults?.paymentMethod;
  }

  public get paymentMethods(): PaymentsPaymentMethod[] {
    return this.methods.paymentMethods;
  }

  public get showPaymentMethods(): boolean {
    return !!this.methods.paymentMethods && this.methods.paymentMethods.length > 0;
  }
}
