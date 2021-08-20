import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/bff/delivery/requests-and-transactions/pending-as-seller/pending-transactions-fixtures.spec';
import { PendingTransaction } from '@api/core/model';
import { RequestsAndTransactionsPendingAsSellerService } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.service';
import { WalletPendingTransactionComponent } from '../wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsComponent } from './wallet-pending-transactions.component';
import { WalletPendingTransactionsListComponent } from '../wallet-pending-transactions-list/wallet-pending-transactions-list.component';

import { Observable, of } from 'rxjs';

describe('WalletPendingTransactionsComponent', () => {
  let component: WalletPendingTransactionsComponent;
  let fixture: ComponentFixture<WalletPendingTransactionsComponent>;
  let mockPendingTransactions$: Observable<PendingTransaction[]> = of(MOCK_PENDING_TRANSACTIONS);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletPendingTransactionComponent, WalletPendingTransactionsListComponent, WalletPendingTransactionsComponent],
      providers: [
        {
          provide: RequestsAndTransactionsPendingAsSellerService,
          useValue: {
            get walletPendingTransactions$() {
              return mockPendingTransactions$;
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPendingTransactionsComponent);
    component = fixture.componentInstance;
    component.walletPendingTransactions$ = mockPendingTransactions$;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
