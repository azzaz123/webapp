import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SubscriptionsSlotItemComponent } from './subscriptions-slot-item.component';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  AnalyticsEvent,
  ClickCatalogManagement,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { MOCK_SUBSCRIPTION_SLOT_CARS, MOCK_SUBSCRIPTION_SLOT_REAL_ESTATE } from '@fixtures/subscription-slots.fixtures.spec';
import { By } from '@angular/platform-browser';
import { MOCK_BUMPS_PACKAGE_BALANCE_MAPPED } from '@fixtures/bump-package.fixtures.spec';

describe('SubscriptionsSlotItemComponent', () => {
  let component: SubscriptionsSlotItemComponent;
  let analyticsService: AnalyticsService;
  let fixture: ComponentFixture<SubscriptionsSlotItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [SubscriptionsSlotItemComponent],
        providers: [{ provide: AnalyticsService, useClass: MockAnalyticsService }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsSlotItemComponent);
    component = fixture.componentInstance;
    component.subscriptionSlot = MOCK_SUBSCRIPTION_SLOT_CARS;
    component.selectedSubscriptionSlot = MOCK_SUBSCRIPTION_SLOT_CARS;
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isSelected', () => {
    it('should return true when selected slot and own subscription are the same', () => {
      component.ngOnChanges();
      expect(component.isSelected).toBe(true);
    });

    it('should return false when selected slot and own subscription are different', () => {
      component.selectedSubscriptionSlot = MOCK_SUBSCRIPTION_SLOT_REAL_ESTATE;
      component.ngOnChanges();
      expect(component.isSelected).toBe(false);
    });
  });

  describe('onClick', () => {
    const event = {
      stopPropagation: () => {},
    };

    beforeEach(() => {
      spyOn(component.selected, 'emit').and.callThrough();
      spyOn(event, 'stopPropagation').and.callThrough();
    });

    it('should emit value when selected subscription is different', () => {
      component.selectedSubscriptionSlot = null;

      component.onClick(MOCK_SUBSCRIPTION_SLOT_CARS, event);

      expect(component.selected.emit).toHaveBeenCalledTimes(1);
      expect(component.selected.emit).toHaveBeenCalledWith(MOCK_SUBSCRIPTION_SLOT_CARS);
      expect(event.stopPropagation).toHaveBeenCalledTimes(0);
    });

    it('should emit null when selecting same subscription slot', () => {
      component.selectedSubscriptionSlot = MOCK_SUBSCRIPTION_SLOT_CARS;

      component.onClick(MOCK_SUBSCRIPTION_SLOT_CARS, event);

      expect(component.selected.emit).toHaveBeenCalledTimes(1);
      expect(component.selected.emit).toHaveBeenCalledWith(null);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should stopPropagation when null subscription', () => {
      component.onClick(null, event);

      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should send event to analytics', () => {
      component.selectedSubscriptionSlot = null;
      const expectedEvent: AnalyticsEvent<ClickCatalogManagement> = {
        name: ANALYTICS_EVENT_NAMES.ClickCatalogManagement,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: SCREEN_IDS.MyCatalog,
        },
      };
      spyOn(analyticsService, 'trackEvent');

      component.onClick(MOCK_SUBSCRIPTION_SLOT_CARS, event);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });

    it('should NOT send event to analytics if user deselects category', () => {
      component.selectedSubscriptionSlot = MOCK_SUBSCRIPTION_SLOT_CARS;
      spyOn(analyticsService, 'trackEvent');

      component.onClick(MOCK_SUBSCRIPTION_SLOT_CARS, event);

      expect(analyticsService.trackEvent).not.toHaveBeenCalled();
    });

    describe('limit', () => {
      describe('and has limit', () => {
        it('should show counter', () => {
          fixture.detectChanges();
          const descriptions = fixture.debugElement.queryAll(By.css('.SubscriptionsSlotItem__description'));

          expect(descriptions[0].nativeElement.textContent).toContain(
            `${component.subscriptionSlot.limit - component.subscriptionSlot.available}/${component.subscriptionSlot.limit}`
          );
        });
      });
      describe('and has not limit', () => {
        it('should show unlimited text', () => {
          component.subscriptionSlot.limit = null;
          fixture.detectChanges();

          const descriptions = fixture.debugElement.queryAll(By.css('.SubscriptionsSlotItem__description'));

          expect(descriptions[0].nativeElement.textContent).toEqual(
            $localize`:@@pro_catalog_manager_unlimited_active_items_label:Unlimited active items`
          );
        });
      });
    });

    describe('available bumps', () => {
      describe('and has bumps', () => {
        const expectedCounter = MOCK_BUMPS_PACKAGE_BALANCE_MAPPED[0].balance;

        beforeEach(() => {
          component.subscriptionSlot.bumpBalance = expectedCounter;
        });
        it('should show counter', () => {
          fixture.detectChanges();
          const descriptions = fixture.debugElement.queryAll(By.css('.SubscriptionsSlotItem__description'));

          expect(descriptions[1].nativeElement.textContent).toContain(`${expectedCounter[0].used}/${expectedCounter[0].total}`);
        });

        describe('extra bumps', () => {
          describe('and has not extra bumps', () => {
            it('should not show extra bumps', () => {
              const descriptions = fixture.debugElement.queryAll(By.css('.SubscriptionsSlotItem__description'));

              fixture.detectChanges();

              expect(descriptions[1]).toBeFalsy();
            });
          });
          describe('and has extra bumps', () => {
            describe('and has a single extra bump', () => {
              const expectedExtraBump = 1;
              beforeEach(() => {
                component.subscriptionSlot.bumpBalance[0].extra = expectedExtraBump;
                fixture.detectChanges();
              });
              it('should show extra bumps', () => {
                const descriptions = fixture.debugElement.queryAll(By.css('.SubscriptionsSlotItem__description'));
                expect(descriptions[1].nativeElement.textContent).toContain(expectedExtraBump);
              });
            });
            describe('and has a multiple extra bumps', () => {
              const expectedExtraBump = 5;
              beforeEach(() => {
                component.subscriptionSlot.bumpBalance[0].extra = expectedExtraBump;
                fixture.detectChanges();
              });
              it('should show extra bumps', () => {
                const descriptions = fixture.debugElement.queryAll(By.css('.SubscriptionsSlotItem__description'));
                expect(descriptions[1].nativeElement.textContent).toContain(expectedExtraBump);
              });
            });
          });
        });
      });
      describe('and has not bumps', () => {
        it('should not show counter', () => {
          component.subscriptionSlot.bumpBalance = [];

          fixture.detectChanges();
          const descriptions = fixture.debugElement.queryAll(By.css('.SubscriptionsSlotItem__description'));

          expect(descriptions[1]).toBeFalsy();
        });
      });
    });
  });
});
