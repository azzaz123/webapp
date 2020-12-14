import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '@core/item/item';
import { TrackingService } from '@core/tracking/tracking.service';
import { UserService } from '@core/user/user.service';
import { PaymentService } from '@core/payments/payment.service';
import { EventService } from '@core/event/event.service';
import { CreditInfo } from '@core/payments/payment.interface';

@Component({
  selector: 'tsl-urgent-confirmation-modal',
  templateUrl: './urgent-confirmation-modal.component.html',
  styleUrls: ['./urgent-confirmation-modal.component.scss'],
})
export class UrgentConfirmationModalComponent implements OnInit {
  public item: Item;
  public code: string;
  public creditUsed: boolean;
  public withCoins: boolean;
  public spent: number;
  public creditInfo: CreditInfo;

  constructor(
    public activeModal: NgbActiveModal,
    private trackingService: TrackingService,
    private paymentService: PaymentService,
    private eventService: EventService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.me().subscribe(() => {
      if (this.code === '200') {
        this.trackingService.track(TrackingService.URGENT_PURCHASE_SUCCESS);
        ga('send', 'event', 'Item', 'urgent-ok');
        appboy.logCustomEvent('VisibilityPurchaseSuccess', { platform: 'web' });
      } else {
        this.trackingService.track(TrackingService.URGENT_PURCHASE_ERROR, {
          error_code: this.code,
        });
        ga('send', 'event', 'Item', 'urgent-ko');
      }
    });
    setTimeout(() => {
      this.paymentService
        .getCreditInfo(false)
        .subscribe((creditInfo: CreditInfo) => {
          if (creditInfo.credit === 0) {
            creditInfo.currencyName = 'wallacredits';
            creditInfo.factor = 1;
          }
          this.creditInfo = creditInfo;
          this.withCoins = creditInfo.currencyName === 'wallacoins';
          this.eventService.emit(
            EventService.TOTAL_CREDITS_UPDATED,
            creditInfo.credit
          );
        });
    }, 1000);
  }

  public facebookShare() {
    const url =
      'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=' +
      encodeURIComponent(this.item.webLink);
    window.open(
      url,
      'fbShareWindow',
      'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
    );
  }

  public twitterShare() {
    const text = 'Mira que acabo de encontrar en @Wallapop:';
    const url =
      'https://twitter.com/intent/tweet?' +
      'text=' +
      encodeURIComponent(text) +
      '&url=' +
      encodeURIComponent(this.item.webLink);
    window.open(
      url,
      'twShareWindow',
      'height=269,width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
    );
  }
}
