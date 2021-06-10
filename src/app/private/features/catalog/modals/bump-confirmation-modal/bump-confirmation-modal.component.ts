import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '@core/payments/payment.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { EventService } from '@core/event/event.service';

@Component({
  selector: 'tsl-bump-confirmation-modal',
  templateUrl: './bump-confirmation-modal.component.html',
  styleUrls: ['./bump-confirmation-modal.component.scss'],
})
export class BumpConfirmationModalComponent implements OnInit {
  public code: string;
  public creditUsed: boolean;
  public withCoins: boolean;
  public spent: number;
  public creditInfo: CreditInfo;

  constructor(public activeModal: NgbActiveModal, private paymentService: PaymentService, private eventService: EventService) {}

  ngOnInit() {
    if (this.code === '200') {
      ga('send', 'event', 'Item', 'bump-ok');
    } else {
      ga('send', 'event', 'Item', 'bump-ko');
    }
    setTimeout(() => {
      this.paymentService.getCreditInfo(false).subscribe((creditInfo: CreditInfo) => {
        if (creditInfo.credit === 0 && !this.creditUsed) {
          creditInfo.currencyName = 'wallacredits';
          creditInfo.factor = 1;
        }
        this.creditInfo = creditInfo;
        this.withCoins = creditInfo.currencyName === 'wallacoins';
        this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED, creditInfo.credit);
      });
    }, 1000);
  }
}
