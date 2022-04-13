import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPaymentModalComponent } from './confirm-payment-modal.component';

describe('ConfirmPaymentModalComponent', () => {
  let component: ConfirmPaymentModalComponent;
  let fixture: ComponentFixture<ConfirmPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmPaymentModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
