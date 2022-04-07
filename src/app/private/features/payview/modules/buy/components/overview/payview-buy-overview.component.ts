import { ChangeDetectionStrategy, Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

import { PayviewBuyService } from '@private/features/payview/modules/buy/services/payview-buy.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PrePaymentError } from '@api/core/errors/delivery/payview/pre-payment';
import { prePaymentsErrorSelector } from '../../mappers/errors/pre-payments-error-selector/pre-payments-error-selector.mapper';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PAYVIEW_BUY_EVENT_TYPE } from '../../enums/payview-buy-event-type.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-payview-buy-overview',
  templateUrl: './payview-buy-overview.component.html',
  styleUrls: ['./payview-buy-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewBuyOverviewComponent implements OnInit, OnDestroy {
  @Input() payviewState: PayviewState;
  @Output() clickBuyButton: EventEmitter<void> = new EventEmitter();
  public disableButton$ = this.buyService.isBuyButtonDisabled$;
  private subscription: Subscription = new Subscription();

  constructor(private buyService: PayviewBuyService, private toastService: ToastService) {}

  ngOnInit() {
    this.showErrorToastWhenBuyError();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public buy(): void {
    this.clickBuyButton.emit();
    const prePaymentError: PrePaymentError = prePaymentsErrorSelector(this.payviewState);
    if (prePaymentError) {
      this.showErrorToast(prePaymentError.message);
      return;
    }
    this.buyService.buy();
  }

  private showErrorToastWhenBuyError(): void {
    this.subscription.add(this.buyService.on(PAYVIEW_BUY_EVENT_TYPE.ERROR, (error: PayviewError) => this.showErrorToast(error.message)));
  }

  private showErrorToast(text: string): void {
    this.toastService.show({
      text,
      type: TOAST_TYPES.ERROR,
    });
  }
}
