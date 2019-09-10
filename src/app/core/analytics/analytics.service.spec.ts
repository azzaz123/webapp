import { EventInterface } from './interfaces/event.interface';
import { Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { UserService } from '../user/user.service';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { EVENT_TYPES } from './analytics-constants';
import { PageViewInterface } from './interfaces/pageview.interface';
import { ANALYTICS_EVENT_NAMES } from './resources/analytics-event-names';


describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService, useValue: {
            me() {
              return Observable.of(MOCK_USER);
            },
          },
        }
      ]
    });

    service = TestBed.get(AnalyticsService);
  });

  describe('initialize', () => {
    it('should initialize the analytics library', () => {
      spyOn(mParticle, 'init');

      service.initialize();

      expect(mParticle.init).toHaveBeenCalled();
    });
  });

  describe('trackEvent', () => {
    it('should send the tracking event', () => {
      const MOCK_EVENT: EventInterface = {
        name: ANALYTICS_EVENT_NAMES.EditItem,
        eventType: EVENT_TYPES.Other,
        attributes: { name: 'Test event' }
      }
      spyOn(mParticle, 'logEvent');

      service.trackEvent(MOCK_EVENT);

      expect(mParticle.logEvent).toHaveBeenCalledWith(MOCK_EVENT.name, MOCK_EVENT.eventType, MOCK_EVENT.attributes);
    });
  });

  describe('trackPageView', () => {
    it('should send the page view event', () => {
      const MOCK_PAGE_VIEW: PageViewInterface = {
        name: 'Chat screen',
        attributes: { name: 'Test page view event' },
        flags: { trackingFlag: true }
      }
      spyOn(mParticle, 'logPageView');

      service.trackPageView(MOCK_PAGE_VIEW);

      expect(mParticle.logPageView).toHaveBeenCalledWith(MOCK_PAGE_VIEW.name, MOCK_PAGE_VIEW.attributes, MOCK_PAGE_VIEW.flags);
    });
  });
});
