import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { PaymentService } from '../../../../core/payments/payment.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';
import { EventService } from '../../../../core/event/event.service';
import { SplitTestService, WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT } from '../../../../core/tracking/split-test.service';

@Component({
  selector:    'tsl-bump-confirmation-modal',
  templateUrl: './bump-confirmation-modal.component.html',
  styleUrls:   ['./bump-confirmation-modal.component.scss']
})
export class BumpConfirmationModalComponent implements OnInit {

  public code: string;
  public creditUsed: boolean;
  public withCoins: boolean;
  public spent: number;
  public creditInfo: CreditInfo;

  constructor(public activeModal: NgbActiveModal,
              private trackingService: TrackingService,
              private userService: UserService,
              private paymentService: PaymentService,
              private eventService: EventService,
              private splitTestService: SplitTestService) {
  }

  ngOnInit() {
    this.userService.me().subscribe(
      () => {
        if (this.code === '200') {
          this.trackingService.track(TrackingService.FEATURED_PURCHASE_SUCCESS);
          this.splitTestService.track(WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT);
          ga('send', 'event', 'Item', 'bump-ok');
        } else {
          this.trackingService.track(TrackingService.FEATURED_PURCHASE_ERROR, { error_code: this.code });
          ga('send', 'event', 'Item', 'bump-ko');
        }
      }
    );
    setTimeout(() => {
      this.paymentService.getCreditInfo(false).subscribe((creditInfo: CreditInfo) => {
        if (creditInfo.credit === 0 && !this.creditUsed) {
          creditInfo.currencyName = 'wallacredits';
          creditInfo.factor = 1;
        }
        this.creditInfo = creditInfo;
        this.withCoins = creditInfo.currencyName === 'wallacoins';
        this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED, creditInfo.credit );
      });
    }, 1000);
  }
}
