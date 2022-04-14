import { Component, Input } from '@angular/core';
import { CONTINUE_TO_PAYPAL_CLOSURE_REASON } from '../../../../enums/continue-to-paypal-closure-reason.enum';

@Component({
  selector: 'tsl-continue-to-paypal-modal',
  templateUrl: './continue-to-paypal-modal.component.html',
  styleUrls: ['./continue-to-paypal-modal.component.scss'],
})
export class ContinueToPayPalModalComponent {
  @Input() closeCallback: (result: CONTINUE_TO_PAYPAL_CLOSURE_REASON) => {};
  public readonly paypalIconUrl: string = 'assets/images/paypal.svg';
  public readonly CONTINUE_TO_PAYPAL_CLOSURE_REASON = CONTINUE_TO_PAYPAL_CLOSURE_REASON;

  public onClose(result: CONTINUE_TO_PAYPAL_CLOSURE_REASON): void {
    this.closeCallback && this.closeCallback(result);
  }
}
