import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/bff/delivery/requests-and-transactions/pending-as-seller/pending-transactions-fixtures.spec';
import { WalletPendingTransactionComponent } from '../wallet-pending-transaction/wallet-pending-transaction.component';
import { WalletPendingTransactionsListComponent } from './wallet-pending-transactions-list.component';

describe('WalletPendingTransactionsListComponent', () => {
  let component: WalletPendingTransactionsListComponent;
  let fixture: ComponentFixture<WalletPendingTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletPendingTransactionComponent, WalletPendingTransactionsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPendingTransactionsListComponent);
    component = fixture.componentInstance;
    component.pendingTransactions = MOCK_PENDING_TRANSACTIONS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
