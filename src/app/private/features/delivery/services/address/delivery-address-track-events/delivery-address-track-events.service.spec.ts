import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  MOCK_SAVE_DELIVERY_ADDRESS_EVENT,
  MOCK_VIEW_SHIPPING_ADDRESS_SCREEN_EVENT,
} from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import { DeliveryAddressTrackEventsService } from './delivery-address-track-events.service';

describe('DeliveryAddressTrackEventsService', () => {
  let service: DeliveryAddressTrackEventsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryAddressTrackEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(DeliveryAddressTrackEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when user views the shipping address', () => {
    it('should send track page view event', () => {
      spyOn(analyticsService, 'trackPageView');

      service.trackViewShippingAddressScreen();

      expect(analyticsService.trackPageView).toHaveBeenCalledWith(MOCK_VIEW_SHIPPING_ADDRESS_SCREEN_EVENT);
    });
  });

  describe('when user clicks save button', () => {
    it('should send track save button event', () => {
      spyOn(analyticsService, 'trackEvent');

      service.trackClickSaveButton();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(MOCK_SAVE_DELIVERY_ADDRESS_EVENT);
    });
  });
});
