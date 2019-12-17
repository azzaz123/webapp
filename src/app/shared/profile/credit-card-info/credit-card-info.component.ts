import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../../core/payments/payment.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from './financial-card';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { SplitTestService, WEB_PAYMENT_EXPERIMENT_TYPE, WEB_PAYMENT_EXPERIMENT_NAME, WEB_PAYMENT_EXPERIMENT_PAGEVIEW_EVENT } from '../../../core/tracking/split-test.service';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss']
})
export class CreditCardInfoComponent implements OnInit {
  
  public isStripe: boolean;
  public paymentMethod: WEB_PAYMENT_EXPERIMENT_TYPE;
  public paymentTypeSabadell = WEB_PAYMENT_EXPERIMENT_TYPE.sabadell;
  @Input() financialCard: FinancialCard;
  @Output() onDeleteCard: EventEmitter<FinancialCard> = new EventEmitter();
  @Output() onDeleteStripeCard: EventEmitter<FinancialCard> = new EventEmitter();

  constructor(private paymentService: PaymentService,
              private modalService: NgbModal,
              private stripeService: StripeService,
              private toastr: ToastrService,
              private i18n: I18nService,
              private splitTestService: SplitTestService) { }

  ngOnInit() {
    this.splitTestService.getVariable<WEB_PAYMENT_EXPERIMENT_TYPE>(WEB_PAYMENT_EXPERIMENT_NAME, WEB_PAYMENT_EXPERIMENT_TYPE.sabadell)
      .subscribe((paymentMethod: number) => {
        this.paymentMethod = +paymentMethod;
        this.isStripe = this.paymentMethod !== this.paymentTypeSabadell;
      });
  }

  deleteCreditCard() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt'
    });
    modalRef.componentInstance.type = 4;
    modalRef.result.then(() => {
      this.paymentService.deleteFinancialCard().subscribe(() => {
        this.onDeleteCard.emit(this.financialCard);
        this.financialCard = null;
      });
    }, () => {});
  }

  public deleteStripeCard(e: Event) {
    e.stopPropagation();
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt'
    });
    modalRef.componentInstance.type = 4;
    modalRef.result.then(() => {
      this.stripeService.deleteCard(this.financialCard.id).subscribe(() => {
        this.onDeleteStripeCard.emit(this.financialCard);
        this.financialCard = null;
      });
    }, () => {});
  }

}
