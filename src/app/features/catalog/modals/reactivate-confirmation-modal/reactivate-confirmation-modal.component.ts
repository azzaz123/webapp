import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditInfo } from '../../../../core/payments/payment.interface';
import { PaymentService } from '../../../../core/payments/payment.service';
import { EventService } from '../../../../core/event/event.service';

@Component({
  selector: 'tsl-reactivate-confirmation-modal',
  templateUrl: './reactivate-confirmation-modal.component.html',
  styleUrls: ['./reactivate-confirmation-modal.component.scss'],
})
export class ReactivateConfirmationModalComponent implements OnInit {
  public code: string;
  public creditUsed: boolean;
  public withCoins: boolean;
  public spent: number;
  public creditInfo: CreditInfo;

  constructor(
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.paymentService
        .getCreditInfo(false)
        .subscribe((creditInfo: CreditInfo) => {
          if (creditInfo.credit === 0) {
            creditInfo.currencyName = 'wallacredits';
            creditInfo.factor = 1;
          }
          this.creditInfo = creditInfo;
          this.eventService.emit(
            EventService.TOTAL_CREDITS_UPDATED,
            creditInfo.credit
          );
        });
    }, 1000);
  }
}
