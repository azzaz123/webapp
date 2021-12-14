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
    fixture.detectChanges();
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
    const event = { stopPropagation: () => {} };

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
  });
});
