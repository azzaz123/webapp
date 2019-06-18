import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../../core/payments/payment.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from './financial-card';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss']
})
export class CreditCardInfoComponent implements OnInit {
  
  public isStripe: boolean;
  @Input() financialCard: FinancialCard;
  @Output() onDeleteCard: EventEmitter<FinancialCard> = new EventEmitter();
  @Output() onDeleteStripeCard: EventEmitter<FinancialCard> = new EventEmitter();

  constructor(private paymentService: PaymentService,
              private modalService: NgbModal,
              private stripeService: StripeService,
              private toastr: ToastrService,
              private i18n: I18nService) { }

  ngOnInit() {
    this.isStripe = this.stripeService.isPaymentMethodStripe();
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
    }, (error: any) => {
      this.toastr.error(this.i18n.getTranslations('bulkDeleteError'));
    });
  }

}
