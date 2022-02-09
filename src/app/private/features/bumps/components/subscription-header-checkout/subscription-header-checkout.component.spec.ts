import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionHeaderCheckoutComponent } from './subscription-header-checkout.component';

describe('SubscriptionHeaderCheckoutComponent', () => {
  let component: SubscriptionHeaderCheckoutComponent;
  let fixture: ComponentFixture<SubscriptionHeaderCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionHeaderCheckoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionHeaderCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
