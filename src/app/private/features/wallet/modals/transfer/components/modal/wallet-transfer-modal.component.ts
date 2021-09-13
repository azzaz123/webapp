import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsHttpService } from '@api/payments/wallets/http/payments-wallets-http.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';

import { finalize } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-wallet-transfer-modal',
  templateUrl: './wallet-transfer-modal.component.html',
  styleUrls: ['./wallet-transfer-modal.component.scss'],
  providers: [PaymentsWalletsHttpService, PaymentsWalletsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransferModalComponent implements OnInit {
  private error: boolean;
  private loading: boolean = true;
  private walletBalance: Money;

  constructor(
    private activeModal: NgbActiveModal,
    private changeDetectorRef: ChangeDetectorRef,
    private paymentsWalletsService: PaymentsWalletsService
  ) {}

  public ngOnInit(): void {
    this.loadBalance();
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public get showBalance(): boolean {
    return !this.showError && !!this.walletBalance;
  }

  public get showError(): boolean {
    return !this.showSpinner && this.error;
  }
  public get showSpinner(): boolean {
    return this.loading;
  }

  private loadBalance(): void {
    this.changeDetectorRef.detectChanges();

    this.paymentsWalletsService.walletBalance$
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (walletBalance) => {
          this.walletBalance = walletBalance;
        },
        error: () => {
          this.error = true;
        },
      });
  }
}
