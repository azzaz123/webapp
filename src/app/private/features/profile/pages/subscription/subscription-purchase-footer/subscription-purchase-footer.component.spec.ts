import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';

import { SubscriptionPurchaseFooterComponent } from './subscription-purchase-footer.component';

describe('SubscriptionPurchaseFooterComponent', () => {
  let component: SubscriptionPurchaseFooterComponent;
  let fixture: ComponentFixture<SubscriptionPurchaseFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPurchaseFooterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPurchaseFooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    component.selectedTier = MAPPED_SUBSCRIPTIONS[0].tiers[0];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
