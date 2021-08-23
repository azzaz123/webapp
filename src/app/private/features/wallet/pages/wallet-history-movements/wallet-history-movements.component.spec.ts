import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletHistoryMovementsComponent } from './wallet-history-movements.component';

describe('WalletHistoryMovementsComponent', () => {
  let component: WalletHistoryMovementsComponent;
  let fixture: ComponentFixture<WalletHistoryMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletHistoryMovementsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletHistoryMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
