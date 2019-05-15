import { Component, EventEmitter } from '@angular/core';
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
export class BuyWallacoinsModalComponent {

  public pack: Pack;
  public hasFinancialCard: boolean;
  public cardType = 'old';
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public mainLoading: boolean = true;
  public loading: boolean;
  public packIndex: number;
  public isStripe: boolean;

  constructor(private errorService: ErrorsService,
              private paymentService: PaymentService,
              public activeModal: NgbActiveModal) {
  }

  get withCredits(): boolean {
    return this.pack.name === 'wallacredits';
  }

  public hasCard(hasCard: boolean) {
    this.hasFinancialCard = hasCard;
    this.mainLoading = false;
  }

  checkout() {
    const order: OrderProExtras = {
      id: UUID.UUID(),
      packs: [this.pack.id],
      origin: 'WEB',
    };
    if (this.isStripe) {
      order.provider = 'STRIPE';
    }
    this.loading = true;
    this.paymentService.orderExtrasProPack(order).subscribe(() => {
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
    fbq('track', 'StartTrial');

    if (!this.hasFinancialCard || this.hasFinancialCard && this.cardType === 'new') {
      localStorage.setItem('transactionType', 'wallapack');
      localStorage.setItem('pack', JSON.stringify(this.pack));
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

}
