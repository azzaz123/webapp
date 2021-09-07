import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WalletPendingTransactionComponent } from './components/wallet-pending-transaction/wallet-pending-transaction.component';

import { WalletBalanceComponent } from './wallet-balance.component';

describe('WalletBalanceComponent', () => {
  let component: WalletBalanceComponent;
  let fixture: ComponentFixture<WalletBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [WalletBalanceComponent, WalletBalanceComponent, WalletPendingTransactionComponent],
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
