import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';
import {
  MAPPED_SUBSCRIPTIONS_ADDED,
  MockSubscriptionService,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
  MOCK_V3_MAPPED_SUBSCRIPTIONS,
  TIER_WITH_DISCOUNT,
} from '@fixtures/subscriptions.fixtures.spec';
import { SpinnerComponent } from '@shared/spinner/spinner.component';
import { SubscriptionListComponent } from './subscription-list.component';

@Component({
  selector: 'tsl-subscription-card',
  template: '',
})
class MockCardComponent {}

describe('SubscriptionListComponent', () => {
  let component: SubscriptionListComponent;
  let fixture: ComponentFixture<SubscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionListComponent, SpinnerComponent, MockCardComponent],
      providers: [
        { provide: SubscriptionsService, useClass: MockSubscriptionService },
        { provide: SubscriptionBenefitsService, useClass: MockSubscriptionBenefitsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionListComponent);
    component = fixture.componentInstance;
  });

  describe('when is loading', () => {
    beforeEach(() => {
      component.isLoading = true;
      fixture.detectChanges();
    });
    it('should show spinner', () => {
      const spinner: HTMLElement = fixture.debugElement.query(By.directive(SpinnerComponent)).nativeElement;
      expect(spinner).toBeTruthy();
    });
    it('should not show cards', () => {
      const card: DebugElement = fixture.debugElement.query(By.directive(MockCardComponent));
      expect(card).toBeFalsy();
    });
  });
  describe('when is not loading', () => {
    beforeEach(() => {
      component.subscriptions = MOCK_V3_MAPPED_SUBSCRIPTIONS;
      component.isLoading = false;
      fixture.detectChanges();
    });
    it('should not show spinner', () => {
      const spinner: DebugElement = fixture.debugElement.query(By.directive(SpinnerComponent));
      expect(spinner).toBeFalsy();
    });
    it('should show subscriptions cards', () => {
      const cards: DebugElement[] = fixture.debugElement.queryAll(By.directive(MockCardComponent));
      expect(cards).toHaveLength(component.subscriptions.length);
    });
  });
  describe('card events', () => {
    beforeEach(() => {
      spyOn(component.clickButton, 'emit');
    });
    it('should emit to parent', () => {
      const subscription = MAPPED_SUBSCRIPTIONS_ADDED[0];
      component.onClickButton(subscription);

      expect(component.clickButton.emit).toHaveBeenCalledTimes(1);
      expect(component.clickButton.emit).toHaveBeenCalledWith(subscription);
    });
  });
  describe('subscription CTA text', () => {
    describe('when is not subscribed', () => {
      describe('and has free trial', () => {
        beforeEach(() => {
          spyOn(component, 'hasOneFreeSubscription').and.returnValue(true);
        });
        it('should show Free Trial text', () => {
          const text = component.getTextButton(MAPPED_SUBSCRIPTIONS_ADDED[1]);

          expect(text).toBe($localize`:@@startFreeTrial:Start free trial`);
        });
      });
      describe('and has not free trial', () => {
        beforeEach(() => {
          spyOn(component, 'hasOneFreeSubscription').and.returnValue(false);
        });
        describe('and has no discounts', () => {
          describe('and has multiple tiers', () => {
            it('should show see plans text', () => {
              const text = component.getTextButton(MAPPED_SUBSCRIPTIONS_ADDED[1]);

              expect(text).toBe($localize`:@@seePlans:See plans`);
            });
          });
          describe('and has one tier', () => {
            it('should show start text', () => {
              const text = component.getTextButton(MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED);

              expect(text).toBe($localize`:@@start:Start`);
            });
          });
        });
        describe('and has tier discounts', () => {
          beforeEach(() => {
            spyOn(component, 'hasDiscount').and.returnValue(TIER_WITH_DISCOUNT);
          });
          it('should show see plans text', () => {
            const text = component.getTextButton(MAPPED_SUBSCRIPTIONS_ADDED[1]);

            expect(text).toBe($localize`:@@pro_subscription_purchase_try_discount_button:Try with discount`);
          });
        });
      });
    });
  });
});
