import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPurchaseSuccessComponent } from './subscription-purchase-success.component';

describe('SubscriptionPurchaseSuccessComponent', () => {
  let component: SubscriptionPurchaseSuccessComponent;
  let fixture: ComponentFixture<SubscriptionPurchaseSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPurchaseSuccessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPurchaseSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
