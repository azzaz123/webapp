import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
