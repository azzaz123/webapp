import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockExternalCommsService } from '@fixtures/external-comms-service.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { ACCESS_TOKEN, MockedUserService, MOCK_FULL_USER, USER_ID } from '@fixtures/user.fixtures.spec';
import { PermissionsInitializerService } from '@core/permissions-initializer/permissions-initializer.service';
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
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';

describe('InitializeAuthenticatedUserService', () => {
  let service: InitializeAuthenticatedUserService;
  let userService: UserService;
  let permissionsService: PermissionsInitializerService;
  let analyticsService: AnalyticsService;
  let featureFlagsService: FeatureFlagService;
  let externalCommsService: ExternalCommsService;
  let experimentationService: ExperimentationService;
  let unreadChatMessagesService: UnreadChatMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: ExternalCommsService, useClass: MockExternalCommsService },
        { provide: UserService, useClass: MockedUserService },
        { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
        { provide: ExperimentationService, useValue: ExperimentationServiceMock },
        { provide: PermissionsInitializerService, useValue: PermissionsInitializerServiceMock },
        { provide: UnreadChatMessagesService, useValue: { initializeUnreadChatMessages: () => {} } },
      ],
    });
    service = TestBed.inject(InitializeAuthenticatedUserService);
    userService = TestBed.inject(UserService);
    analyticsService = TestBed.inject(AnalyticsService);
    externalCommsService = TestBed.inject(ExternalCommsService);
    featureFlagsService = TestBed.inject(FeatureFlagService);
    experimentationService = TestBed.inject(ExperimentationService);
    permissionsService = TestBed.inject(PermissionsInitializerService);
    unreadChatMessagesService = TestBed.inject(UnreadChatMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the default permissions', () => {
    spyOn(permissionsService, 'setDefaultPermissions');

    service.initialize();

    expect(permissionsService.setDefaultPermissions).toHaveBeenCalledTimes(1);
  });

  it('should call initialization of unread messages', () => {
    spyOn(unreadChatMessagesService, 'initializeUnreadChatMessages');

    service.initialize();

    expect(unreadChatMessagesService.initializeUnreadChatMessages).toHaveBeenCalledTimes(1);
  });

  it('should set the permissions for logged user', fakeAsync(() => {
    spyOn(permissionsService, 'setUserPermissions');

    service.initialize();
    tick();

    expect(permissionsService.setUserPermissions).toHaveBeenCalledWith(MOCK_FULL_USER);
  }));

  it('should get the flags after user has logged in', fakeAsync(() => {
    spyOn(featureFlagsService, 'getFlags').and.callThrough();

    service.initialize();
    tick();

    expect(featureFlagsService.getFlags).toHaveBeenCalledTimes(1);
  }));

  it('should initialize the analytics library', fakeAsync(() => {
    spyOn(analyticsService, 'initializeAnalyticsWithAuthenticatedUser');

    service.initialize();
    tick();

    expect(analyticsService.initializeAnalyticsWithAuthenticatedUser).toHaveBeenCalledTimes(1);
  }));

  it('should initialize experimentation service', fakeAsync(() => {
    spyOn(experimentationService, 'initializeExperimentationWithAuthenticatedUser');

    service.initialize();
    tick();

    expect(experimentationService.initializeExperimentationWithAuthenticatedUser).toHaveBeenCalledTimes(1);
  }));

  it('should initialize braze service', fakeAsync(() => {
    spyOn(externalCommsService, 'initializeBraze');

    service.initialize();
    tick();

    expect(externalCommsService.initializeBraze).toHaveBeenCalledTimes(1);
  }));
});
