import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { UserService } from '../user/user.service';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';
import mParticle from '@mparticle/web-sdk';
import appboyKit from '@mparticle/web-appboy-kit';
import { DeviceService } from '@core/device/device.service';

const user = {
  setUserAttribute: () => {},
};

jest.mock('@mparticle/web-sdk', () => ({
  __esModule: true,
  default: {
    init: (key, config) => {
      config.identityCallback({
        getUser: () => user,
      });
    },
    logEvent: (_eventName, _eventType, _eventAttributes) => {},
    logPageView: (_pageName, _pageAttributes, _pageFlags) => {},
    Identity: {
      getCurrentUser: () => user,
    },
  },
  namedExport: 'mParticle',
}));

jest.mock('@mparticle/web-appboy-kit', () => ({
  __esModule: true,
  default: {
    register: (_config) => {},
  },
  namedExport: 'appboyKit',
}));

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let deviceService: DeviceService;
  let deviceIdValue: string;

  beforeEach(() => {
    deviceIdValue = 'deviceId';

    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            me() {
              return of(MOCK_USER);
            },
          },
        },
        {
          provide: DeviceService,
          useValue: {
            getDeviceId: () => {},
          },
        },
      ],
    });

    deviceService = TestBed.inject(DeviceService);
    service = TestBed.inject(AnalyticsService);
  });

  describe('initialize', () => {
    describe('when there is an identifier in cookies', () => {
      it('should initialize the analytics library with existing identifier', () => {
        let user = mParticle.Identity.getCurrentUser();
        spyOn(mParticle, 'init').and.callThrough();
        spyOn(user, 'setUserAttribute');
        spyOn(appboyKit, 'register');
        spyOn(deviceService, 'getDeviceId').and.returnValue('newUUID');

        service.initialize();

        expect(mParticle.init).toHaveBeenCalledTimes(1);
        expect(user.setUserAttribute).toHaveBeenCalledWith(
          'deviceId',
          'newUUID'
        );
        expect(appboyKit.register).toHaveBeenCalled();
      });
    });

    describe('when there is no identifier in cookies', () => {
      it('should initialize the analytics library ', () => {
        deviceIdValue = undefined;
        spyOn(mParticle, 'init').and.callThrough();
        spyOn(mParticle.Identity.getCurrentUser(), 'setUserAttribute');
        spyOn(appboyKit, 'register');
        spyOn(deviceService, 'getDeviceId').and.returnValue('newDeviceId');

        service.initialize();

        expect(mParticle.init).toHaveBeenCalled();
        expect(
          mParticle.Identity.getCurrentUser().setUserAttribute
        ).toHaveBeenCalledWith('deviceId', 'newDeviceId');
        expect(appboyKit.register).toHaveBeenCalled();
      });
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
          bruh: 'Thanks!',
        },
      };
      spyOn(mParticle, 'logEvent');

      service.trackEvent(MOCK_EVENT);

      expect(mParticle.logEvent).toHaveBeenCalledWith(
        MOCK_EVENT.name,
        MOCK_EVENT.eventType,
        MOCK_EVENT.attributes
      );
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
        flags: { trackingFlag: true },
      };
      spyOn(mParticle, 'logPageView');

      service.trackPageView(MOCK_PAGE_VIEW);

      expect(mParticle.logPageView).toHaveBeenCalledWith(
        MOCK_PAGE_VIEW.name,
        MOCK_PAGE_VIEW.attributes,
        MOCK_PAGE_VIEW.flags
      );
    });
  });
});
