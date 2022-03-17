import { BankAccountTrackingEventsService } from '@private/features/wallet/pages/bank-details/services/bank-account-tracking-events/bank-account-tracking-events.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PayBumpItems } from '@core/analytics/resources/events-interfaces';
import { ANALYTIC_EVENT_TYPES, ANALYTICS_EVENT_NAMES, AnalyticsEvent, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { BumpsTrackingEventsService } from '@private/features/bumps/services/bumps-tracking-events.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { UserService } from '@core/user/user.service';
import { MOCK_ITEMS_TO_BUY_FREE } from '@fixtures/visibility.fixtures.spec';

describe('BumpsTrackingEventsService', () => {
  let service: BumpsTrackingEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BumpsTrackingEventsService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        {
          provide: UserService,
          useValue: {
            get isPro() {
              return true;
            },
          },
        },
      ],
    });
    service = TestBed.inject(BumpsTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Track pay bump items', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent').and.callThrough();
    });

    it('should track event', () => {
      const expectedTotalToPay = 10;
      service.trackPayBumpItems(MOCK_ITEMS_TO_BUY_FREE, expectedTotalToPay);

      const expectedEvent: AnalyticsEvent<PayBumpItems> = {
        name: ANALYTICS_EVENT_NAMES.PayBumpItems,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: SCREEN_IDS.BumpCheckout,
          isPro: true,
          bumps: MOCK_ITEMS_TO_BUY_FREE.length,
          subscriptionBumps: MOCK_ITEMS_TO_BUY_FREE.length,
          zoneBumps: MOCK_ITEMS_TO_BUY_FREE.filter((selectedItem) => selectedItem.productType === BUMP_TYPE.ZONE_BUMP).length,
          cityBumps: MOCK_ITEMS_TO_BUY_FREE.filter((selectedItem) => selectedItem.productType === BUMP_TYPE.CITY_BUMP).length,
          countryBumps: MOCK_ITEMS_TO_BUY_FREE.filter((selectedItem) => selectedItem.productType === BUMP_TYPE.COUNTRY_BUMP).length,
          amountPaid: expectedTotalToPay,
        },
      };

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });
});
