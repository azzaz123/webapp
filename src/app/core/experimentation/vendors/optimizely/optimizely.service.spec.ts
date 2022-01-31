import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { OptimizelyService } from './optimizely.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { SDK_KEY_DEVELOPMENT } from './resources/sdk-keys';
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
  });
});
