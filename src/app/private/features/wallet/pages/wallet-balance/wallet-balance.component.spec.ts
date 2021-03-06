import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { KYCPropertiesService } from '@api/payments/kyc-properties/kyc-properties.service';
import { MOCK_KYC_NO_NEED_PROPERTIES_API } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { WalletBalanceComponent } from './wallet-balance.component';
import { WalletBalanceInfoComponent } from '@private/features/wallet/pages/wallet-balance/modules/wallet-balance-info/wallet-balance-info.component';
import { WalletBalanceTrackingEventService } from '@private/features/wallet/pages/wallet-balance/services/wallet-balance-tracking-event.service';
import { WalletPendingTransactionComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transactions/wallet-pending-transactions.component';
import { WalletPendingTransactionsListComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transactions-list/wallet-pending-transactions-list.component';
import { SharedErrorActionComponent } from '@shared/error-action';
import { WalletTransferService } from '@private/features/wallet/services/transfer/wallet-transfer.service';

import { of } from 'rxjs';
import { DeliveriesOngoingService } from '@api/bff/delivery/deliveries/ongoing/deliveries-ongoing.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('WalletBalanceComponent', () => {
  let component: WalletBalanceComponent;
  let fixture: ComponentFixture<WalletBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SvgIconComponent,
        WalletBalanceComponent,
        WalletBalanceInfoComponent,
        WalletPendingTransactionComponent,
        WalletPendingTransactionsComponent,
        WalletPendingTransactionsListComponent,
        SharedErrorActionComponent,
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: PaymentsWalletsService,
          useValue: {
            get walletBalance$() {
              return of(null);
            },
          },
        },

        {
          provide: KYCPropertiesService,
          useValue: {
            get KYCProperties$() {
              return of(MOCK_KYC_NO_NEED_PROPERTIES_API);
            },
          },
        },
        {
          provide: WalletTransferService,
          useValue: {
            checkPayUserBankAccount() {
              return of(null);
            },
            transfer() {
              return of(null);
            },
          },
        },
        {
          provide: WalletBalanceTrackingEventService,
          useValue: {
            trackViewWallet() {},
          },
        },
        {
          provide: DeliveriesOngoingService,
          useValue: {
            get pendingTransactionsAndRequestsAsSeller() {
              return of(null);
            },
            get pendingTransactionsAndRequestsAsBuyer() {
              return of(null);
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
