import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ExperimentationService } from './experimentation.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { LoadExternalLibsServiceMock } from '@fixtures/load-external-libs.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { OptimizeService } from '@core/experimentation/vendors/optimize/optimize.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { OptimizelyServiceMock, OptimizeServiceMock } from '@fixtures/experimentation.fixtures.spec';
import { OPTIMIZELY_FLAG_KEYS } from '@core/experimentation/vendors/optimizely/resources/optimizely-flag-keys';
import { OptimizelyService } from '@core/experimentation/vendors/optimizely/optimizely.service';
import { OptimizelyDecideOption } from '@optimizely/optimizely-sdk';
import { ANALYTICS_EVENT_NAMES } from '@core/analytics/analytics-constants';

describe('ExperimentService', () => {
  let service: ExperimentationService;
  let userService: UserService;
  let loadExternalLibService: LoadExternalLibsService;
  let optimizelyService: OptimizelyService;
  let optimizeService: OptimizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExperimentationService,
        {
          provide: LoadExternalLibsService,
          useValue: LoadExternalLibsServiceMock,
        },
        {
          provide: UserService,
          useClass: MockedUserService,
        },
        {
          provide: OptimizelyService,
          useValue: OptimizelyServiceMock,
        },
        {
          provide: OptimizeService,
          useValue: OptimizeServiceMock,
        },
      ],
    });
    service = TestBed.inject(ExperimentationService);
    userService = TestBed.inject(UserService);
    loadExternalLibService = TestBed.inject(LoadExternalLibsService);
    optimizelyService = TestBed.inject(OptimizelyService);
    optimizeService = TestBed.inject(OptimizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when initializing', () => {
    describe('and is a non logged user', () => {
      it('should not initialize optimizely service', fakeAsync(() => {
        spyOn(OptimizelyServiceMock, 'initialize');

        service.initializeExperimentationWithUnauthenticatedUser();
        tick();

        expect(OptimizelyServiceMock.initialize).not.toHaveBeenCalled();
      }));
    });

    describe('and is a logged user', () => {
      it('should initialize optimizely service', fakeAsync(() => {
        spyOn(OptimizelyServiceMock, 'initialize');

        service.initializeExperimentationWithAuthenticatedUser();
        tick();

        expect(OptimizelyServiceMock.initialize).toHaveBeenCalled();
      }));
    });
  });

  describe('when the user is ready', () => {
    it('should initialize the experiment context', fakeAsync(() => {
      spyOn(OptimizelyServiceMock, 'initExperimentContext');

      service.initExperimentContext({ age: '25' });
      tick();

      expect(OptimizelyServiceMock.initExperimentContext).toHaveBeenCalledWith({ age: '25' });
    }));

    it('should get the variations', fakeAsync(() => {
      spyOn(OptimizelyServiceMock, 'getVariations');

      service.getVariations({
        flagKeys: [OPTIMIZELY_FLAG_KEYS.WebmParticleTest],
        options: [OptimizelyDecideOption.DISABLE_DECISION_EVENT],
      });
      tick();

      expect(OptimizelyServiceMock.getVariations).toHaveBeenCalledWith({
        flagKeys: [OPTIMIZELY_FLAG_KEYS.WebmParticleTest],
        options: [OptimizelyDecideOption.DISABLE_DECISION_EVENT],
      });
    }));

    it('should call the optimizely tracking event', fakeAsync(() => {
      spyOn(OptimizelyServiceMock, 'track');

      service.trackOptimizelyEvent({ eventKey: ANALYTICS_EVENT_NAMES.ClickAcceptOffer });
      tick();

      expect(OptimizelyServiceMock.track).toHaveBeenCalledWith({ eventKey: ANALYTICS_EVENT_NAMES.ClickAcceptOffer });
    }));
  });
});
