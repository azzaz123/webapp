import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockExternalCommsService } from '@fixtures/external-comms-service.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { ACCESS_TOKEN, MockedUserService, MOCK_FULL_USER, USER_ID } from '@fixtures/user.fixtures.spec';
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
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';

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
  let eventService: EventService;

  let emitSuccessChatEvents;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: ExternalCommsService, useClass: MockExternalCommsService },
        { provide: UserService, useClass: MockedUserService },
        { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
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
          provide: AccessTokenService,
          useValue: { accessToken: ACCESS_TOKEN },
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
        EventService,
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
    eventService = TestBed.inject(EventService);

    emitSuccessChatEvents = () => {
      eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);
      eventService.emit(EventService.CHAT_RT_CONNECTED);
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the permissions for logged user', fakeAsync(() => {
    spyOn(permissionsService, 'setUserPermissions');

    service.initialize();
    tick();

    expect(permissionsService.setUserPermissions).toHaveBeenCalledWith(MOCK_FULL_USER);
  }));

  it('should initialize the analytics library', fakeAsync(() => {
    spyOn(analyticsService, 'initializeAnalyticsWithAuthenticatedUser');

    service.initialize();
    tick();

    expect(analyticsService.initializeAnalyticsWithAuthenticatedUser).toHaveBeenCalledTimes(1);
  }));

  it('should initialize external Braze communications', fakeAsync(() => {
    spyOn(externalCommsService, 'initializeBraze');

    service.initialize();
    tick();

    expect(externalCommsService.initializeBraze).toHaveBeenCalledTimes(1);
  }));

  describe('when initializing real time chat', () => {
    beforeEach(fakeAsync(() => {
      spyOn(callsService, 'init').and.returnValue(of({}));
      spyOn(inboxService, 'init');
    }));

    it('should perform a xmpp connect when the login event is triggered with the correct user data', fakeAsync(() => {
      spyOn(realTime, 'connect');

      service.initialize();
      eventService.emit(EventService.USER_LOGIN, ACCESS_TOKEN);
      tick();

      expect(realTime.connect).toHaveBeenCalledWith(USER_ID, ACCESS_TOKEN);
    }));

    it('should call callsService.init twice if user is professional', fakeAsync(() => {
      spyOn(userService, 'isProfessional').and.returnValue(of(true));

      service.initialize();
      tick();
      emitSuccessChatEvents();

      expect(callsService.init).toHaveBeenCalledTimes(2);
    }));

    it('should call inboxService.init', fakeAsync(() => {
      service.initialize();
      tick();
      emitSuccessChatEvents();

      expect(inboxService.init).toHaveBeenCalledTimes(1);
    }));
  });
});
