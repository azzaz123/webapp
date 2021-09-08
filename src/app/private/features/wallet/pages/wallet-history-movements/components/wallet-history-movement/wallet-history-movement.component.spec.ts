import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletHistoryMovementComponent } from './wallet-history-movement.component';

describe('WalletHistoryMovementComponent', () => {
  let component: WalletHistoryMovementComponent;
  let fixture: ComponentFixture<WalletHistoryMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletHistoryMovementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletHistoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
