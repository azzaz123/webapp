import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ExperimentationService } from './experimentation.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { LoadExternalLibsServiceMock } from '@fixtures/load-external-libs.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { OptimizeService } from '@core/experimentation/vendors/optimize/optimize.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { OptimizelyServiceMock, OptimizeServiceMock } from '@fixtures/experimentation.fixtures.spec';
import { OptimizelyService } from '@core/experimentation/vendors/optimizely/optimizely.service';
import { OptimizelyDecideOption } from '@optimizely/optimizely-sdk';
import { OPTIMIZELY_EXPERIMENT_KEYS } from '@core/experimentation/vendors/optimizely/resources/optimizely-experiment-keys';

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

  describe('when initializing optimizely', () => {
    it('should initialize optimizely service', fakeAsync(() => {
      spyOn(OptimizelyServiceMock, 'initialize');

      service.initializeOptimizelyService();
      tick();

      expect(OptimizelyServiceMock.initialize).toHaveBeenCalled();
    }));
  });

  describe('when optimizely is ready', () => {
    beforeEach(() => {
      spyOn(OptimizelyServiceMock, 'getVariations').and.returnValue({
        [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest]: {
          variationKey: 'variant_a',
          enabled: true,
          ruleKey: 'exp_innovation_test',
        },
      });
    });

    it('should get the variations', fakeAsync(() => {
      service.getVariations({
        flagKeys: [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest],
      });
      tick();

      expect(OptimizelyServiceMock.getVariations).toHaveBeenCalledWith({
        flagKeys: [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest],
      });
    }));

    it('should return if the flag is enabled', fakeAsync(() => {
      const isEnabled = service.isFlagEnabled(OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest);
      tick();

      expect(OptimizelyServiceMock.getVariations).toHaveBeenCalledWith({
        flagKeys: [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest],
        options: [OptimizelyDecideOption.DISABLE_DECISION_EVENT],
      });
      expect(isEnabled).toBe(true);
    }));

    it('should return the variation of the flag', fakeAsync(() => {
      const variation = service.getVariationFromFlag(OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest);
      tick();

      expect(OptimizelyServiceMock.getVariations).toHaveBeenCalledWith({
        flagKeys: [OPTIMIZELY_EXPERIMENT_KEYS.NewMParticleTest],
      });
      expect(variation).toBe('variant_a');
    }));

    it('should propagate new optimizely attributes', () => {
      spyOn(optimizelyService, 'setNewOptimizelyUserAttributes');
      const newAttributes = { test: 'some new attributes' };

      service.setNewOptimizelyUserAttributes(newAttributes);

      expect(optimizelyService.setNewOptimizelyUserAttributes).toHaveBeenCalledWith(newAttributes);
    });
  });
});
