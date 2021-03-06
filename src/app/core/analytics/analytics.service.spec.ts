import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { UserService } from '../user/user.service';
import { MockedUserService, MOCK_FULL_USER } from '@fixtures/user.fixtures.spec';
import { AnalyticsEvent, AnalyticsPageView } from './analytics-constants';
import { DeviceService } from '@core/device/device.service';
import { MARKET_PROVIDER } from '@configs/market.config';
import { LOCALE_ID } from '@angular/core';
import { APP_LOCALE_MOCK, MARKET_MOCK } from '@fixtures/analytics.fixtures.spec';
import { mParticle } from '@core/analytics/mparticle.constants';
import { DeviceType } from '@core/device/deviceType.enum';

const user = {
  setUserAttribute: () => {},
};

const optimizelyKit = {
  register: () => {},
};

jest.mock('@core/analytics/mparticle.constants', () => ({
  mParticle: {
    init: (key, config) => {
      config.identityCallback({
        getUser: () => user,
      });
    },
    logEvent: (_eventName, _eventType, _eventAttributes) => {},
    logPageView: (_pageName, _pageAttributes, _pageFlags) => {},
    ready: () => {},
    Identity: {
      getCurrentUser: () => user,
    },
  },
  appboyKit: {
    register: () => {},
  },
}));

jest.mock('@mtempranowalla/web-optimizely-kit', () => optimizelyKit);

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let deviceService: DeviceService;
  let deviceIdValue: string;
  let userService: UserService;

  beforeEach(() => {
    deviceIdValue = 'deviceId';

    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: MockedUserService,
        },
        {
          provide: DeviceService,
          useValue: {
            getDeviceId: () => {},
            getDeviceType: () => {},
          },
        },
        {
          provide: MARKET_PROVIDER,
          useValue: MARKET_MOCK,
        },
        {
          provide: LOCALE_ID,
          useValue: APP_LOCALE_MOCK,
        },
      ],
    });

    deviceService = TestBed.inject(DeviceService);
    service = TestBed.inject(AnalyticsService);
    userService = TestBed.inject(UserService);
  });

  describe('initialize', () => {
    it('should send the device type', () => {
      spyOn(user, 'setUserAttribute');
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.MOBILE);

      service.initializeAnalyticsWithUnauthenticatedUser();

      expect(user.setUserAttribute).toHaveBeenCalledWith('webDeviceType', DeviceType.MOBILE);
    });

    describe('when there is a device identifier in cookies', () => {
      it('should initialize the analytics library with existing identifier', () => {
        spyOn(mParticle, 'init').and.callThrough();
        spyOn(user, 'setUserAttribute');
        spyOn(deviceService, 'getDeviceId').and.returnValue('newUUID');

        service.initializeAnalyticsWithUnauthenticatedUser();

        expect(mParticle.init).toHaveBeenCalledTimes(1);
        expect(user.setUserAttribute).toHaveBeenCalledWith('deviceId', 'newUUID');
      });
    });

    describe('when there is no device identifier in cookies', () => {
      it('should initialize the analytics library ', () => {
        deviceIdValue = undefined;
        spyOn(mParticle, 'init').and.callThrough();
        spyOn(mParticle.Identity.getCurrentUser(), 'setUserAttribute');
        spyOn(deviceService, 'getDeviceId').and.returnValue('newDeviceId');

        service.initializeAnalyticsWithUnauthenticatedUser();

        expect(mParticle.init).toHaveBeenCalled();
        expect(mParticle.Identity.getCurrentUser().setUserAttribute).toHaveBeenCalledWith('deviceId', 'newDeviceId');
      });
    });

    describe('when there is a user logged with email and id', () => {
      it('should initialize the analytics library with email and id', fakeAsync(() => {
        spyOn(mParticle, 'init').and.callThrough();
        spyOn(optimizelyKit, 'register');
        const expectedIdentities = {
          customerid: MOCK_FULL_USER.id,
          email: MOCK_FULL_USER.email,
        };

        service.initializeAnalyticsWithAuthenticatedUser(MOCK_FULL_USER);
        tick();

        expect(optimizelyKit.register).toHaveBeenCalledTimes(1);
        expect(mParticle.init).toHaveBeenCalledTimes(1);
        expect(mParticle.init).toHaveBeenCalledWith(expect.anything(), {
          identifyRequest: { userIdentities: expectedIdentities },
          identityCallback: expect.anything(),
          isDevelopmentMode: expect.anything(),
          dataPlan: expect.anything(),
        });
      }));
    });

    describe('when there is not a user logged with email and id', () => {
      it('should initialize the analytics library without user Identities', () => {
        spyOn(mParticle, 'init').and.callThrough();
        const expectedIdentities = {};

        service.initializeAnalyticsWithUnauthenticatedUser();

        expect(mParticle.init).toHaveBeenCalledTimes(1);
        expect(mParticle.init).toHaveBeenCalledWith(expect.anything(), {
          identifyRequest: { userIdentities: expectedIdentities },
          identityCallback: expect.anything(),
          isDevelopmentMode: expect.anything(),
          dataPlan: expect.anything(),
        });
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
        flags: { trackingFlag: true },
      };
      spyOn(mParticle, 'logPageView');

      service.trackPageView(MOCK_PAGE_VIEW);

      expect(mParticle.logPageView).toHaveBeenCalledWith(MOCK_PAGE_VIEW.name, MOCK_PAGE_VIEW.attributes, MOCK_PAGE_VIEW.flags);
    });
  });

  describe('market', () => {
    it('should return market pass in the constructor', () => {
      const market = service.market;

      expect(market).toEqual(MARKET_MOCK);
    });
  });

  describe('appLocale', () => {
    it('should return app locale pass in the constructor', () => {
      const appLocale = service.appLocale;

      expect(appLocale).toEqual(APP_LOCALE_MOCK);
    });
  });
});
