import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { KYC_STATUS } from '@api/core/model/kyc-properties/kyc-status.enum';
import { KYCBannerSpecifications } from '@api/core/model/kyc-properties/interfaces/kyc-banner-specifications.interface';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';

import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'tsl-wallet-balance-info',
  templateUrl: './wallet-balance-info.component.html',
  styleUrls: ['./wallet-balance-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceInfoComponent implements OnInit {
  public isError = false;
  public loading = true;
  public walletBalance: Money;
  private specifications: KYCBannerSpecifications;

  constructor(
    private paymentsWalletsService: PaymentsWalletsService,
    private toastService: ToastService,
    private kycPropertiesService: KYCPropertiesService,
    private errorActionService: WalletSharedErrorActionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBalanceAndSpecifications();
  }

  public get allowTransfer(): boolean {
    return this.hasPositiveBalance && this.isValidStatus;
  }

  private get hasPositiveBalance(): boolean {
    return this.walletBalance?.amount.total > 0;
  }

  private get isValidStatus(): boolean {
    return this.specifications.status === KYC_STATUS.NO_NEED || this.specifications.status === KYC_STATUS.VERIFIED;
  }

  private loadBalanceAndSpecifications(): void {
    this.changeDetectorRef.detectChanges();

    combineLatest([
      this.paymentsWalletsService.walletBalance$,
      this.kycPropertiesService.KYCProperties$.pipe(
        switchMap((properties: KYCProperties) => {
          return this.kycPropertiesService.getBannerSpecificationsFromProperties(properties);
        })
      ),
    ]).subscribe({
      next: ([walletBalance, specifications]: [Money, KYCBannerSpecifications]) => {
        this.walletBalance = walletBalance;
        this.specifications = specifications;

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.isError = true;
        this.toastService.show(DEFAULT_ERROR_TOAST);
        this.errorActionService.show(error);

        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
