import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { RequestsAndTransactionsPendingAsSellerService } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.service';
import { WalletBalanceComponent } from './wallet-balance.component';
import { WalletBalanceInfoComponent } from '@private/features/wallet/pages/wallet-balance/modules/wallet-balance-info/wallet-balance-info.component';
import { WalletPendingTransactionComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transactions/wallet-pending-transactions.component';
import { WalletPendingTransactionsListComponent } from '@private/features/wallet/pages/wallet-balance/components/wallet-pending-transactions-list/wallet-pending-transactions-list.component';
import { WalletSharedErrorActionComponent } from '@private/features/wallet/shared/error-action';

import { of } from 'rxjs';

describe('WalletBalanceComponent', () => {
  let component: WalletBalanceComponent;
  let fixture: ComponentFixture<WalletBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WalletBalanceComponent,
        WalletBalanceInfoComponent,
        WalletPendingTransactionComponent,
        WalletPendingTransactionsComponent,
        WalletPendingTransactionsListComponent,
        WalletSharedErrorActionComponent,
      ],
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
          provide: RequestsAndTransactionsPendingAsSellerService,
          useValue: {
            get walletPendingTransactions$() {
              return of([]);
            },
          },
        },
      ],
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
