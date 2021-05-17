import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';

import { SubscriptionTierSelectorComponent } from './subscription-tier-selector.component';

describe('SubscriptionTierSelectorComponent', () => {
  let component: SubscriptionTierSelectorComponent;
  let fixture: ComponentFixture<SubscriptionTierSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionTierSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionTierSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    component.selectedTier = MAPPED_SUBSCRIPTIONS[0].tiers[0];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
