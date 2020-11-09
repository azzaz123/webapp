import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../../core/item/item';
import { PaymentService } from '../../../../core/payments/payment.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';

@Component({
  selector: 'tsl-reactivate-modal',
  templateUrl: './reactivate-modal.component.html',
  styleUrls: ['./reactivate-modal.component.scss'],
})
export class ReactivateModalComponent {
  public price: number;
  public item: Item;
  public creditInfo: CreditInfo;

  constructor(
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.paymentService.getCreditInfo().subscribe((creditInfo: CreditInfo) => {
      if (creditInfo.credit === 0) {
        creditInfo.currencyName = 'wallacredits';
        creditInfo.factor = 1;
      }
      this.creditInfo = creditInfo;
    });
  }
}
