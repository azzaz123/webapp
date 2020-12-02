import { Component, OnDestroy, OnInit } from '@angular/core';
import { BillingInfoResponse } from 'app/core/payments/payment.interface';
import { PaymentService } from 'app/core/payments/payment.service';
import { UserService } from 'app/core/user/user.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tsl-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  public canDownloadInvoice: boolean;
  private isCardealer: boolean;
  public activeIds: string[] = ['custom-panel-1'];

  constructor(
    private paymentService: PaymentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.handleIsCardealerUser();
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

  set handleModal(formIsFull) {
    this.activeIds = formIsFull ? [] : ['custom-panel-1'];
  }
}
