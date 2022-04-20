import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_FULL_USER, USER_ID } from '@fixtures/user.fixtures.spec';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { OptimizelyService } from './optimizely.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { environment } from '@environments/environment';
import { BASE_USER_ATTRIBUTES } from './resources/user-attributes.constants';
import { OPTIMIZELY_EXPERIMENT_KEYS } from './resources/optimizely-experiment-keys';

const OptimizelySdk = require('@optimizely/optimizely-sdk');

jest.mock('@optimizely/optimizely-sdk', () => ({
  createInstance: () => ClientInstance,
  OptimizelyDecideOption: { DISABLE_DECISION_EVENT: 'DISABLE_DECISION_EVENT' },
}));

const ClientInstance = {
  onReady: () => new Promise<{ success: boolean }>((resolve) => resolve({ success: true })),
  notificationCenter: {
    addNotificationListener: () => {},
  },
  createUserContext: () => UserContext,
  getOptimizelyConfig: () => ({ getDatafile: () => '{}' }),
};

let userAttributes: { [key: string]: string } = BASE_USER_ATTRIBUTES;

const UserContext = {
  decide: () => ({ ruleKey: 'exp_innovation_test', variationKey: 'variant_a' }),
  decideForKeys: () => ({
    [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest]: {},
  }),
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

  describe('when initializing', () => {
    describe('if initialization is successful', () => {
      it('should create instance', fakeAsync(() => {
        spyOn(OptimizelySdk, 'createInstance').and.callThrough();

        service.initialize();
        tick();

        expect(OptimizelySdk.createInstance).toHaveBeenCalledWith({ sdkKey: environment.optimizelySdkKey });
        service.isReady$.subscribe((ready) => expect(ready).toBeTruthy());
      }));

      it('should create a user context', fakeAsync(() => {
        spyOn(ClientInstance, 'createUserContext').and.callThrough();

        service.initialize();
        tick();

        expect(ClientInstance.createUserContext).toHaveBeenCalledWith(USER_ID, { ...BASE_USER_ATTRIBUTES });
      }));

      it('should set experiment values to mParticle user attributes once mParticle is initialized', fakeAsync(() => {
        spyOn(UserContext, 'decide').and.callThrough();
        spyOn(analyticsService, 'setUserAttribute').and.callThrough();

        service.initialize();
        analyticsService.initializeAnalyticsWithAuthenticatedUser(MOCK_FULL_USER);
        tick();

        expect(UserContext.decide).toHaveBeenCalledTimes(Object.keys(OPTIMIZELY_EXPERIMENT_KEYS).length);
        expect(analyticsService.setUserAttribute).toHaveBeenCalledWith('exp_innovation_test', 'variant_a');
      }));

      it('should complete observable', fakeAsync(() => {
        let isReady;
        let isCompleted;
        service.isReady$.subscribe(
          (_isReady) => {
            isReady = _isReady;
          },
          () => {},
          () => {
            isCompleted = true;
          }
        );

        service.initialize();
        tick();

        expect(isReady).toBe(true);
        expect(isCompleted).toBe(true);
      }));
    });

    describe('if initialization fails', () => {
      beforeEach(() => {
        spyOn(ClientInstance, 'onReady').and.callFake(() => new Promise<{ success: boolean }>((resolve) => resolve({ success: false })));
      });

      it('should complete observable', fakeAsync(() => {
        let isReady;
        let isCompleted;
        service.isReady$.subscribe(
          (_isReady) => {
            isReady = _isReady;
          },
          () => {},
          () => {
            isCompleted = true;
          }
        );

        service.initialize();
        tick();

        expect(isReady).toBe(true);
        expect(isCompleted).toBe(true);
      }));

      it('should not create a user context', fakeAsync(() => {
        spyOn(ClientInstance, 'createUserContext').and.callThrough();

        service.initialize();
        tick();

        expect(ClientInstance.createUserContext).not.toHaveBeenCalled();
      }));
    });
  });

  describe('when setting optimizely attributes', () => {
    it('should update attributes if there are new, and keep the original ones', fakeAsync(() => {
      spyOn(UserContext, 'setAttribute').and.callThrough();
      const newAttributes = { test: 'some new attributes' };
      const expectedUserAttributes = { ...newAttributes, ...userAttributes };

      service.initialize();
      tick();
      service.setNewOptimizelyUserAttributes(newAttributes);

      expect(UserContext.setAttribute).toHaveBeenCalledWith('test', 'some new attributes');
      expect(userAttributes).toEqual(expectedUserAttributes);
    }));

    it('should keep the value of the original attribute if it is already set', fakeAsync(() => {
      spyOn(UserContext, 'setAttribute').and.callThrough();
      userAttributes = { time: 'morning', ...BASE_USER_ATTRIBUTES };
      const newAttribute = { time: 'noon' };

      service.initialize();
      tick();
      service.setNewOptimizelyUserAttributes(newAttribute);

      expect(UserContext.setAttribute).not.toHaveBeenCalled();
    }));

    describe('but there is no user context', () => {
      beforeEach(() => {
        spyOn(ClientInstance, 'onReady').and.callFake(() => new Promise<{ success: boolean }>((resolve) => resolve({ success: false })));
      });

      it('should not update attributes', fakeAsync(() => {
        spyOn(UserContext, 'setAttribute').and.callThrough();
        const newAttributes = { test: 'some new attributes' };

        service.initialize();
        tick();
        service.setNewOptimizelyUserAttributes(newAttributes);

        expect(UserContext.setAttribute).not.toHaveBeenCalled();
      }));
    });
  });

  describe('when requesting variation', () => {
    it('should return the value', fakeAsync(() => {
      spyOn(UserContext, 'decideForKeys').and.callThrough();

      service.initialize();
      tick();
      const variations = service.getVariations({ flagKeys: [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest] });

      expect(UserContext.decideForKeys).toHaveBeenCalled();
      expect(variations).toEqual({
        [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest]: {},
      });
    }));

    describe('but there is no user context', () => {
      beforeEach(() => {
        spyOn(ClientInstance, 'onReady').and.callFake(() => new Promise<{ success: boolean }>((resolve) => resolve({ success: false })));
      });

      it('should return an empty object', fakeAsync(() => {
        spyOn(UserContext, 'decideForKeys').and.callThrough();

        service.initialize();
        tick();
        const variations = service.getVariations({ flagKeys: [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest] });

        expect(variations).toEqual({});
      }));
    });
  });
});
