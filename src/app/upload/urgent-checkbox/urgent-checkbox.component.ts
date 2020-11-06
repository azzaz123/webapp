import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CreditInfo } from '../../core/payments/payment.interface';
import { PaymentService } from '../../core/payments/payment.service';

@Component({
  selector: 'tsl-urgent-checkbox',
  templateUrl: './urgent-checkbox.component.html',
  styleUrls: ['./urgent-checkbox.component.scss'],
})
export class UrgentCheckboxComponent implements OnInit {
  public isUrgent = false;
  @Output() public urgentSelected = new EventEmitter<boolean>();
  @Input() categoryId: number;
  @Input() urgentPrice: string = null;
  public creditInfo: CreditInfo;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.paymentService.getCreditInfo().subscribe((creditInfo: CreditInfo) => {
      this.creditInfo = creditInfo;
    });
  }

  public selectUrgent(): void {
    this.isUrgent = !this.isUrgent;
    this.urgentSelected.emit(this.isUrgent);
  }
}
