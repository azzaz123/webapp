import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPendingTransactionsListComponent } from './wallet-pending-transactions-list.component';

describe('WalletPendingTransactionsListComponent', () => {
  let component: WalletPendingTransactionsListComponent;
  let fixture: ComponentFixture<WalletPendingTransactionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletPendingTransactionsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPendingTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
