import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPendingTransactionsComponent } from './wallet-pending-transactions.component';

describe('WalletPendingTransactionsComponent', () => {
  let component: WalletPendingTransactionsComponent;
  let fixture: ComponentFixture<WalletPendingTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletPendingTransactionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletPendingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
