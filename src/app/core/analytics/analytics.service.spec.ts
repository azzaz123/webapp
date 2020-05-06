
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { UserService } from '../user/user.service';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';
import mParticle from '@mparticle/web-sdk';

jest.mock('@mparticle/web-sdk', () => ({
  __esModule: true,
  default: {
    init: () => {},
    logEvent: (_eventName, _eventType, _eventAttributes) => {},
    logPageView: (_pageName, _pageAttributes, _pageFlags) => {}
  },
  namedExport: 'mParticle'
}));

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService, useValue: {
            me() {
              return observableOf(MOCK_USER);
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
      interface AsapEvent {
        bruh: string;
      }
      const MOCK_EVENT: AnalyticsEvent<AsapEvent> = {
        name: 'AsapEvent' as any,
        eventType: 1 as any,
        attributes: {
          bruh: 'Thanks!'
        }
      };
      spyOn(mParticle, 'logEvent');

      service.trackEvent(MOCK_EVENT);

      expect(mParticle.logEvent).toHaveBeenCalledWith(MOCK_EVENT.name, MOCK_EVENT.eventType, MOCK_EVENT.attributes);
    });
  });

  describe('trackPageView', () => {
    it('should send the page view event', () => {
      interface AsapPageEvent {
        name: string;
      }
      const MOCK_PAGE_VIEW: AnalyticsPageView<AsapPageEvent> = {
        name: 'Chat screen',
        attributes: { name: 'Test page view event' },
        flags: { trackingFlag: true }
      };
      spyOn(mParticle, 'logPageView');

      service.trackPageView(MOCK_PAGE_VIEW);

      expect(mParticle.logPageView).toHaveBeenCalledWith(MOCK_PAGE_VIEW.name, MOCK_PAGE_VIEW.attributes, MOCK_PAGE_VIEW.flags);
    });
  });
});
