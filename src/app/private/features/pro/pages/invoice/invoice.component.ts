import { Component, OnInit } from '@angular/core';
import { BillingInfoResponse } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { UserService } from '@core/user/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tsl-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  public canDownloadInvoice: boolean;
  public activeIds: string[] = ['custom-panel-1'];
  private isCardealer: boolean;

  constructor(private paymentService: PaymentService, private userService: UserService) {}

  ngOnInit() {
    this.handleIsCardealerUser();
  }

  public handleModalAndInvoicePermission(): void {
    if (!this.canDownloadInvoice && !this.isCardealer) {
      this.paymentService
        .getBillingInfo(false)
        .pipe(take(1))
        .subscribe(
          (res: BillingInfoResponse) => {
            this.canDownloadInvoice = !!res && !!res.cif && !!res.id;
            this.handleModal = this.canDownloadInvoice;
          },
          () => {
            this.canDownloadInvoice = false;
          }
        );
    }
  }

  private handleIsCardealerUser(): void {
    this.userService
      .isProfessional()
      .pipe(take(1))
      .subscribe((isCardealer: boolean) => {
        this.isCardealer = isCardealer;
        if (!this.isCardealer) {
          this.handleModalAndInvoicePermission();
        }
      });
  }

  set handleModal(formIsFull: boolean) {
    this.activeIds = formIsFull ? [] : ['custom-panel-1'];
  }
}
