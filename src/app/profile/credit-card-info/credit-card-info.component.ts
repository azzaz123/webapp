import { Component, OnInit } from '@angular/core';
import { FinancialCard } from '../../core/payments/payment.interface';
import { PaymentService } from '../../core/payments/payment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss']
})
export class CreditCardInfoComponent implements OnInit {

  public financialCard: FinancialCard;

  constructor(private paymentService: PaymentService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
      this.financialCard = financialCard;
    });
  }

  deleteCreditCard() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.type = 4;
    modalRef.result.then(() => {
      this.paymentService.deleteFinancialCard().subscribe(() => {
        this.financialCard = null;
      });
    }, () => {});

  }

}
