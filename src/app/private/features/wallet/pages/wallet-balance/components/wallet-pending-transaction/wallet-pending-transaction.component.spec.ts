import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_PENDING_TRANSACTIONS } from '@api/fixtures/bff/delivery/requests-and-transactions/pending-as-seller/pending-transactions-fixtures.spec';
import { WalletPendingTransactionComponent } from './wallet-pending-transaction.component';

describe('WalletPendingTransactionComponent', () => {
  let component: WalletPendingTransactionComponent;
  let fixture: ComponentFixture<WalletPendingTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletPendingTransactionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPendingTransactionComponent);
    component = fixture.componentInstance;
    component.walletPendingTransaction = MOCK_PENDING_TRANSACTIONS[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
