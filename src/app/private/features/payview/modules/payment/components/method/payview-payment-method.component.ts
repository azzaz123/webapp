import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CreditCard } from '@api/core/model';
import { I18nService } from '@core/i18n/i18n.service';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PAYVIEW_PAYMENT_ICONS } from '@private/features/payview/constants/payview-payment-icons';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-payview-payment-method',
  templateUrl: './payview-payment-method.component.html',
  styleUrls: ['./payview-payment-method.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('enterAnimation', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [style({ height: '*' }), animate('100ms 50ms ease', style({ height: 0 }))]),
      transition('void => *', [style({ height: '0' }), animate('100ms ease', style({ height: '*' }))]),
    ]),
  ],
})
export class PayviewPaymentMethodComponent {
  @Input() public card: CreditCard;
  @Input() public id: number;
  @Input() public isChecked: boolean;
  @Input() public method: PaymentsPaymentMethod;
  @Output() public checked: EventEmitter<number> = new EventEmitter<number>();
  @Output() public edited: EventEmitter<number> = new EventEmitter<number>();

  constructor(private i18nService: I18nService) {}

  public get actionTitle(): string {
    if (!this.creditCardNumber) {
      return this.i18nService.translate(TRANSLATION_KEY.PAYVIEW_PAYMENT_ADD_CREDIT_CARD);
    }
    return this.i18nService.translate(TRANSLATION_KEY.PAYVIEW_PAYMENT_EDIT_CREDIT_CARD);
  }

  public get creditCardNumber(): string {
    return this.card?.lastFourDigits;
  }

  public editMethod(): void {
    this.edited.emit(this.id);
  }

  public get icon(): string {
    return PAYVIEW_PAYMENT_ICONS[this.method.method];
  }

  public get isEditable(): boolean {
    return this.isChecked && this.isCreditCard;
  }

  public get isCreditCard(): boolean {
    return this.method.method === PAYVIEW_PAYMENT_METHOD.CREDIT_CARD;
  }

  public get isPayPal(): boolean {
    return this.method.method === PAYVIEW_PAYMENT_METHOD.PAYPAL;
  }

  public selectMethod(index: number): void {
    this.checked.emit(this.id);
  }
}
