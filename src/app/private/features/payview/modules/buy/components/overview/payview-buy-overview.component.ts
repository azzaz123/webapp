import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { PAYVIEW_BUY_EVENT_TYPE } from '@private/features/payview/modules/buy/enums/payview-buy-event-type.enum';
import { PayviewBuyService } from '@private/features/payview/modules/buy/services/payview-buy.service';

import { Subscription } from 'rxjs';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PrePaymentError } from '@api/core/errors/delivery/payview/pre-payment';
import { prePaymentsErrorSelector } from '../../mappers/errors/pre-payments-error-selector/pre-payments-error-selector.mapper';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

@Component({
  selector: 'tsl-payview-buy-overview',
  templateUrl: './payview-buy-overview.component.html',
  styleUrls: ['./payview-buy-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewBuyOverviewComponent implements OnDestroy, OnInit {
  @Input() payviewState: PayviewState;

  private subscription: Subscription;

  constructor(private buyService: PayviewBuyService, private toastService: ToastService) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.subscribe();
  }

  public buy(): void {
    const prePaymentError: PrePaymentError = prePaymentsErrorSelector(this.payviewState);
    if (prePaymentError) {
      this.showErrorToast(prePaymentError.message);
      return;
    }
    this.buyService.buy();
  }

  private subscribe(): void {
    this.subscription = this.buyService.on(PAYVIEW_BUY_EVENT_TYPE.ERROR, () => {});
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private showErrorToast(text: string): void {
    this.toastService.show({
      text,
      type: TOAST_TYPES.ERROR,
    });
  }
}
