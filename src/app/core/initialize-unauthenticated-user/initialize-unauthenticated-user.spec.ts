import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockExternalCommsService } from '@fixtures/external-comms-service.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { PermissionsInitializerService } from '@core/permissions-initializer/permissions-initializer.service';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';
import { InitializeUnauthenticatedUserService } from './initialize-unauthenticated-user.service';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { ExperimentationServiceMock } from '@fixtures/experimentation.fixtures.spec';
import { PermissionsInitializerServiceMock } from '@fixtures/permissions-initializer.fixtures.spec';

describe('InitializeUnauthenticatedUserService', () => {
  let service: InitializeUnauthenticatedUserService;
  let userService: UserService;
  let permissionsService: PermissionsInitializerService;
  let analyticsService: AnalyticsService;
  let featureFlagsService: FeatureFlagService;
  let externalCommsService: ExternalCommsService;
  let experimentationService: ExperimentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: ExternalCommsService, useClass: MockExternalCommsService },
        { provide: UserService, useClass: MockedUserService },
        { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
        { provide: ExperimentationService, useValue: ExperimentationServiceMock },
        { provide: PermissionsInitializerService, useValue: PermissionsInitializerServiceMock },
      ],
    });
    service = TestBed.inject(InitializeUnauthenticatedUserService);
    userService = TestBed.inject(UserService);
    analyticsService = TestBed.inject(AnalyticsService);
    externalCommsService = TestBed.inject(ExternalCommsService);
    featureFlagsService = TestBed.inject(FeatureFlagService);
    experimentationService = TestBed.inject(ExperimentationService);
    permissionsService = TestBed.inject(PermissionsInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the default permissions', () => {
    spyOn(permissionsService, 'setDefaultPermissions');

    service.initialize();

    expect(permissionsService.setDefaultPermissions).toHaveBeenCalledTimes(1);
  });

  it('should get the flags after user has logged in', fakeAsync(() => {
    spyOn(featureFlagsService, 'getFlags');

    service.initialize();
    tick();

    expect(featureFlagsService.getFlags).toHaveBeenCalledTimes(1);
  }));

  it('should initialize the analytics library', fakeAsync(() => {
    spyOn(analyticsService, 'initializeAnalyticsWithUnauthenticatedUser');

    service.initialize();
    tick();

    expect(analyticsService.initializeAnalyticsWithUnauthenticatedUser).toHaveBeenCalledTimes(1);
  }));

  it('should initialize experimentation service', fakeAsync(() => {
    spyOn(experimentationService, 'initializeExperimentationWithUnauthenticatedUser');

    service.initialize();
    tick();

    expect(experimentationService.initializeExperimentationWithUnauthenticatedUser).toHaveBeenCalledTimes(1);
  }));

  it('should initialize braze service', fakeAsync(() => {
    spyOn(externalCommsService, 'initializeBraze');

    service.initialize();
    tick();

    expect(externalCommsService.initializeBraze).toHaveBeenCalledTimes(1);
  }));
});
