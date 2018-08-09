import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { PaymentService } from '../../../../core/payments/payment.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';

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
  public credit: number;

  constructor(public activeModal: NgbActiveModal,
              private trackingService: TrackingService,
              private userService: UserService,
              private paymentService: PaymentService) {
  }

  ngOnInit() {
    this.userService.me().subscribe(
      () => {
        if (this.code === '200') {
          this.trackingService.track(TrackingService.FEATURED_PURCHASE_SUCCESS);
          ga('send', 'event', 'Item', 'bump-ok');
        } else {
          this.trackingService.track(TrackingService.FEATURED_PURCHASE_ERROR, { error_code: this.code });
          ga('send', 'event', 'Item', 'bump-ko');
        }
      });
    this.paymentService.getCreditInfo(true).subscribe((creditInfo: CreditInfo) => {
      this.withCoins = creditInfo.currencyName === 'wallacoins';
      this.credit = creditInfo.credit - +this.spent;
    });
  }

}
