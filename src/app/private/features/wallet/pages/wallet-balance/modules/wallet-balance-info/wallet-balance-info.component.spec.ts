import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletBalanceInfoComponent } from './wallet-balance-info.component';

describe('WalletBalanceInfoComponent', () => {
  let component: WalletBalanceInfoComponent;
  let fixture: ComponentFixture<WalletBalanceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletBalanceInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletBalanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
