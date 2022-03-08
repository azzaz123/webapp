import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockExternalCommsService } from '@fixtures/external-comms-service.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { PermissionsInitializerService } from '@core/permissions/permissions.service';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';
import { InitializeAuthenticatedUserService } from './initialize-authenticated-user.service';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { ExperimentationServiceMock } from '@fixtures/experimentation.fixtures.spec';
import { PermissionsInitializerServiceMock } from '@fixtures/permissions-initializer.fixtures.spec';
import { InboxService } from '@private/features/chat/core/inbox/inbox.service';
import { RealTimeService } from '@core/message/real-time.service';
import { CallsService } from '@core/conversation/calls.service';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie';

describe('InitializeAuthenticatedUserService', () => {
  let service: InitializeAuthenticatedUserService;
  let userService: UserService;
  let permissionsService: PermissionsInitializerService;
  let analyticsService: AnalyticsService;
  let featureFlagsService: FeatureFlagService;
  let externalCommsService: ExternalCommsService;
  let experimentationService: ExperimentationService;
  let inboxService: InboxService;
  let realTime: RealTimeService;
  let callsService: CallsService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: ExternalCommsService, useClass: MockExternalCommsService },
        { provide: UserService, useValue: MockedUserService },
        { provide: FeatureFlagService, useValue: FeatureFlagServiceMock },
        { provide: ExperimentationService, useValue: ExperimentationServiceMock },
        { provide: PermissionsInitializerService, useValue: PermissionsInitializerServiceMock },
        {
          provide: InboxService,
          useValue: {
            init() {},
            saveInbox() {},
          },
        },
        {
          provide: RealTimeService,
          useValue: {
            connect() {},
            disconnect() {},
            reconnect() {},
          },
        },
        {
          provide: CallsService,
          useValue: {
            init() {
              return of();
            },
            syncItem() {},
          },
        },
        {
          provide: CookieService,
          useValue: {
            value: null,
            put() {},
            get() {
              return this.value;
            },
          },
        },
      ],
    });
    service = TestBed.inject(InitializeAuthenticatedUserService);
    userService = TestBed.inject(UserService);
    analyticsService = TestBed.inject(AnalyticsService);
    externalCommsService = TestBed.inject(ExternalCommsService);
    featureFlagsService = TestBed.inject(FeatureFlagService);
    experimentationService = TestBed.inject(ExperimentationService);
    permissionsService = TestBed.inject(PermissionsInitializerService);
    inboxService = TestBed.inject(InboxService);
    realTime = TestBed.inject(RealTimeService);
    callsService = TestBed.inject(CallsService);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
