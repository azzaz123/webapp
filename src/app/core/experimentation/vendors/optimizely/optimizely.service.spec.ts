import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import { MockedUserService, USER_ID } from '@fixtures/user.fixtures.spec';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { OptimizelyService } from './optimizely.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SDK_KEY_DEVELOPMENT } from './resources/sdk-keys';
import { BASE_USER_ATTRIBUTES } from './resources/user-attributes.constants';
import { OPTIMIZELY_FLAG_KEYS } from './resources/optimizely-flag-keys';
import { ANALYTICS_EVENT_NAMES } from '@core/analytics/analytics-constants';

const OptimizelySdk = require('@optimizely/optimizely-sdk');

jest.mock('@optimizely/optimizely-sdk', () => ({
  createInstance: () => ClientInstance,
  enums: {
    NOTIFICATION_TYPES: {
      DECISION: 'DECISION:type, userId, attributes, decisionInfo',
    },
  },
}));

const ClientInstance = {
  onReady: () => new Promise<{ success: boolean }>((resolve) => resolve({ success: true })),
  notificationCenter: {
    addNotificationListener: () => {},
  },
  createUserContext: () => UserContext,
};

let userAttributes: { [key: string]: string } = BASE_USER_ATTRIBUTES;

const UserContext = {
  decideForKeys: () => {},
  getAttributes: () => userAttributes,
  setAttribute: (key, value) => {
    let newAttribute = {};
    newAttribute[key] = value;
    userAttributes = { ...newAttribute, ...userAttributes };
  },
  trackEvent: () => {},
};

describe('Optimizely service', () => {
  let service: OptimizelyService;
  let userService: UserService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OptimizelyService,
        {
          provide: UserService,
          useClass: MockedUserService,
        },
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
      ],
    });
    service = TestBed.inject(OptimizelyService);
    userService = TestBed.inject(UserService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when initializing', () => {
    it('should create instance', fakeAsync(() => {
      spyOn(OptimizelySdk, 'createInstance').and.callThrough();

      service.initialize();
      tick();

      expect(OptimizelySdk.createInstance).toHaveBeenCalledWith({ sdkKey: SDK_KEY_DEVELOPMENT });
      service.isReady$.subscribe((ready) => expect(ready).toBeTruthy());
    }));

    it('should add the notification listener', fakeAsync(() => {
      spyOn(ClientInstance.notificationCenter, 'addNotificationListener');

      service.initialize();
      tick();

      expect(ClientInstance.notificationCenter.addNotificationListener).toHaveBeenCalled();
    }));
  });

  describe('when initializing experiment context', () => {
    let createUserContextSpy: jasmine.Spy;

    beforeEach(fakeAsync(() => {
      createUserContextSpy = spyOn(ClientInstance, 'createUserContext').and.callThrough();
      service.initialize();
      tick();
    }));

    describe('and there is none created before', () => {
      it('should create new user context', () => {
        const attributes = { app: 'wallapop' };

        service.initExperimentContext(attributes);

        expect(createUserContextSpy).toHaveBeenCalledWith(USER_ID, { ...attributes, ...BASE_USER_ATTRIBUTES });
      });
    });

    describe('and there is one already created', () => {
      beforeEach(() => {
        service.initExperimentContext({});
      });

      afterEach(() => {
        //CLEAN user context attributes and leave the default ones
        userAttributes = BASE_USER_ATTRIBUTES;
      });

      it('should not create a new user context', () => {
        service.initExperimentContext({});

        expect(createUserContextSpy).toHaveBeenCalledTimes(1);
      });

      it('should update attributes if there are new, and keep the original ones', () => {
        spyOn(UserContext, 'setAttribute').and.callThrough();
        const newAttributes = { test: 'some new attributes' };
        const expectedUserAttributes = { ...newAttributes, ...userAttributes };

        service.initExperimentContext(newAttributes);

        expect(UserContext.setAttribute).toHaveBeenCalledWith('test', 'some new attributes');
        expect(userAttributes).toEqual(expectedUserAttributes);
      });

      it('should keep the value of the original attribute if it is already set', () => {
        spyOn(UserContext, 'setAttribute').and.callThrough();
        userAttributes = { ...{ time: 'morning' }, ...BASE_USER_ATTRIBUTES };
        const newAttribute = { time: 'noon' };

        service.initExperimentContext(newAttribute);

        expect(UserContext.setAttribute).not.toHaveBeenCalled();
        expect(userAttributes.time).toEqual('morning');
      });
    });
  });

  describe('when requesting variation', () => {
    it('should return the value', fakeAsync(() => {
      spyOn(UserContext, 'decideForKeys');

      service.initialize();
      tick();
      service.initExperimentContext({});
      service.getVariations({ flagKeys: [OPTIMIZELY_FLAG_KEYS.TestPlaceholder] });

      expect(UserContext.decideForKeys).toHaveBeenCalled();
    }));
  });

  describe('when tracking an event', () => {
    it('should fire a track event', fakeAsync(() => {
      spyOn(UserContext, 'trackEvent');

      service.initialize();
      tick();
      service.initExperimentContext({});
      service.track({ eventKey: ANALYTICS_EVENT_NAMES.ClickItemCard });

      expect(UserContext.trackEvent).toHaveBeenCalled();
    }));
  });
});
