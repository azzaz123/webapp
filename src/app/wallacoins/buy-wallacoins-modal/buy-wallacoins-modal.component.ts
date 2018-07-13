import { Component, EventEmitter, OnInit } from '@angular/core';
import { Pack } from '../../core/payments/pack';
import { PaymentService } from '../../core/payments/payment.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UUID } from 'angular2-uuid';
import { OrderProExtras } from '../../core/payments/payment.interface';
import { Response } from '@angular/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-buy-wallacoins-modal',
  templateUrl: './buy-wallacoins-modal.component.html',
  styleUrls: ['./buy-wallacoins-modal.component.scss']
})
export class BuyWallacoinsModalComponent implements OnInit {

  public pack: Pack;
  public hasFinancialCard: boolean;
  public cardType = 'old';
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public mainLoading: boolean = true;
  public loading: boolean;

  constructor(private errorService: ErrorsService,
              private paymentService: PaymentService,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  public hasCard(hasCard: boolean) {
    this.hasFinancialCard = hasCard;
    this.mainLoading = false;
  }

  checkout() {
    const order: OrderProExtras = {
      id: UUID.UUID(),
      packs: [this.pack.id]
    };
    this.loading = true;
    this.paymentService.orderExtrasProPack(order).subscribe(() => {
      this.track(order);
      this.buy(order.id);
    }, (error: Response) => {
      this.loading = false;
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('packError');
      }
    });
  }

  private buy(orderId: string) {
    if (!this.hasFinancialCard || this.hasFinancialCard && this.cardType === 'new') {
      this.sabadellSubmit.emit(orderId);
    } else {
      this.paymentService.pay(orderId).subscribe(() => {
        this.activeModal.close();
      }, () => {
        this.errorService.i18nError('packError');
        this.loading = false;
      });
    }
  }

  private track(order: OrderProExtras) {
    //this.trackingService.track(TrackingService.PRO_PURCHASE_CHECKOUTPROEXTRACART, {selected_packs: order.packs});
  }

}
