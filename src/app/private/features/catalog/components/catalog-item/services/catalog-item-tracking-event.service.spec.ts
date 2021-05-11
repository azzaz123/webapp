import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { CatalogItemTrackingEventService } from './catalog-item-tracking-event.service';
import { ITEM_DATA3 } from '@fixtures/item.fixtures.spec';

describe('CatalogItemTrackingEventService', () => {
  let service: CatalogItemTrackingEventService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CatalogItemTrackingEventService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: UserService, useClass: MockedUserService },
      ],
    });
    service = TestBed.inject(CatalogItemTrackingEventService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when item reactivation', () => {
    const item = ITEM_DATA3;
    beforeEach(() => {
      spyOn(service, 'trackReactivateItemEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');
    });

    describe('and user is not pro', () => {
      const isPro = false;

      it('should send click item card event', () => {
        service.trackReactivateItemEvent(item, isPro);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(item, isPro);
      });
    });

    describe('and user is pro', () => {
      const isPro = true;

      it('should send click item card event', () => {
        service.trackReactivateItemEvent(item, isPro);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(item, isPro);
      });
    });
  });
});
