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
import { InitializeLoggedUserService } from './initialize-logged-user.service';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { ExperimentationServiceMock } from '@fixtures/experimentation.fixtures.spec';
import { PermissionsInitializerServiceMock } from '@fixtures/permissions-initializer.fixtures.spec';

describe('InitializeLoggedUserService', () => {
  let service: InitializeLoggedUserService;
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
        { provide: UserService, useValue: MockedUserService },
        { provide: FeatureFlagService, useValue: FeatureFlagServiceMock },
        { provide: ExperimentationService, useValue: ExperimentationServiceMock },
        { provide: PermissionsInitializerService, useValue: PermissionsInitializerServiceMock },
      ],
    });
    service = TestBed.inject(InitializeLoggedUserService);
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
});
