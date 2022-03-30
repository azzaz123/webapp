import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { PAYVIEW_BUY_DEFAULT_ERROR, PAYVIEW_BUY_ERRORS } from '@private/features/payview/modules/buy/constants/payview-buy-copies';
import { PAYVIEW_BUY_EVENT_TYPE } from '@private/features/payview/modules/buy/enums/payview-buy-event-type.enum';
import { PayviewBuyService } from '@private/features/payview/modules/buy/services/payview-buy.service';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';

import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-payview-buy-overview',
  templateUrl: './payview-buy-overview.component.html',
  styleUrls: ['./payview-buy-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewBuyOverviewComponent implements OnDestroy, OnInit {
  public errorMessage: string;

  private subscription: Subscription;

  constructor(private buyService: PayviewBuyService, private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.subscribe();
  }

  public buy(): void {
    this.buyService.buy();
  }

  private getErrorMessage(error: PayviewError): string {
    return PAYVIEW_BUY_ERRORS[error.code] ?? PAYVIEW_BUY_DEFAULT_ERROR;
  }

  private subscribe(): void {
    this.subscription = this.buyService.on(PAYVIEW_BUY_EVENT_TYPE.ERROR, (error: PayviewError) => {
      this.errorMessage = this.getErrorMessage(error);
      this.changeDetectorRef.detectChanges();
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
