import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';
import {
  MockSubscriptionService,
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
  SUBSCRIPTIONS,
  TIER_WITH_DISCOUNT,
} from '@fixtures/subscriptions.fixtures.spec';
import { SpinnerComponent } from '@shared/spinner/spinner.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SubscriptionListComponent } from './subscription-list.component';

@Component({
  selector: 'tsl-subscription-card',
  template: '',
})
class MockCardComponent {}

describe('SubscriptionListComponent', () => {
  let component: SubscriptionListComponent;
  let fixture: ComponentFixture<SubscriptionListComponent>;
  let deviceDetector: DeviceDetectorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionListComponent, SpinnerComponent, MockCardComponent],
      providers: [
        { provide: SubscriptionsService, useClass: MockSubscriptionService },
        { provide: SubscriptionBenefitsService, useClass: MockSubscriptionBenefitsService },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionListComponent);
    deviceDetector = TestBed.inject(DeviceDetectorService);
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
      component.subscriptions = SUBSCRIPTIONS;
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
  describe('Show subscription cards', () => {
    beforeEach(() => {
      component.subscriptions = SUBSCRIPTIONS;
      component.isLoading = false;
    });
    describe('and is not a pro user', () => {
      beforeEach(() => {
        component.isPro = false;
        fixture.detectChanges();
      });
      it('should show a single subscription list', () => {
        const subscriptionList: DebugElement[] = fixture.debugElement.queryAll(By.css('.SubscriptionList__container'));

        expect(subscriptionList).toHaveLength(1);
      });
      it('should show subscriptions cards together', () => {
        const cards: DebugElement[] = fixture.debugElement
          .queryAll(By.css('.SubscriptionList__container'))[0]
          .queryAll(By.directive(MockCardComponent));

        expect(cards).toHaveLength(component.subscriptions.length);
      });
    });
    describe('and is pro user', () => {
      beforeEach(() => {
        component.isPro = true;
        fixture.detectChanges();
      });
      it('should show a two subscription list', () => {
        const subscriptionList: DebugElement[] = fixture.debugElement.queryAll(By.css('.SubscriptionList__container'));

        expect(subscriptionList).toHaveLength(2);
      });
      it('should show subscribed cards', () => {
        const cards: DebugElement[] = fixture.debugElement
          .queryAll(By.css('.SubscriptionList__container'))[0]
          .queryAll(By.directive(MockCardComponent));

        expect(cards).toHaveLength(component.subscriptions.filter((subscription) => subscription.subscribed_from).length);
      });
      it('should show not subscribed cards', () => {
        const cards: DebugElement[] = fixture.debugElement
          .queryAll(By.css('.SubscriptionList__container'))[1]
          .queryAll(By.directive(MockCardComponent));

        expect(cards).toHaveLength(component.subscriptions.filter((subscription) => !subscription.subscribed_from).length);
      });
    });
  });
  describe('card events', () => {
    beforeEach(() => {
      spyOn(component.clickButton, 'emit');
    });
    it('should emit to parent', () => {
      const subscription = MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS;
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
          const text = component.getTextButton(MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS);

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
              const text = component.getTextButton(MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS);

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
            const text = component.getTextButton(MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS);

            expect(text).toBe($localize`:@@pro_subscription_purchase_try_discount_button:Try with discount`);
          });
        });
      });
    });
  });
  describe('device detector', () => {
    describe('when is desktop', () => {
      beforeEach(() => {
        spyOn(deviceDetector, 'isMobile').and.callThrough();
        component.ngOnInit();
      });
      it('should call the service', () => {
        expect(deviceDetector.isMobile).toBeCalledTimes(1);
        expect(deviceDetector.isMobile).toHaveBeenCalledWith();
      });
      it('should set the value', () => {
        expect(component.isMobile).toBe(false);
      });
    });
    describe('when is mobile', () => {
      beforeEach(() => {
        spyOn(deviceDetector, 'isMobile').and.returnValue(true);
        component.ngOnInit();
      });
      it('should call the service', () => {
        expect(deviceDetector.isMobile).toBeCalledTimes(1);
        expect(deviceDetector.isMobile).toHaveBeenCalledWith();
      });
      it('should set the value', () => {
        expect(component.isMobile).toBe(true);
      });
    });
  });
});
