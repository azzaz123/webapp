import { Component, Input } from '@angular/core';
import { CONFIRM_PAYMENT_MODAL_CLOSURE } from './confirm-payment-modal-closure.enum';

@Component({
  selector: 'tsl-confirm-payment-modal',
  templateUrl: './confirm-payment-modal.component.html',
  styleUrls: ['./confirm-payment-modal.component.scss'],
})
export class ConfirmPaymentModalComponent {
  @Input() closeCallback: (result: CONFIRM_PAYMENT_MODAL_CLOSURE) => {};
  public readonly paypalIconUrl: string = 'assets/images/confirm-payment-modal/paypal.svg';
  public readonly CONFIRM_PAYMENT_MODAL_CLOSURE = CONFIRM_PAYMENT_MODAL_CLOSURE;

  public onClose(result: CONFIRM_PAYMENT_MODAL_CLOSURE): void {
    this.closeCallback && this.closeCallback(result);
  }
}
