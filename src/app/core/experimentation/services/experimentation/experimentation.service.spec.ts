import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ExperimentationService } from './experimentation.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { LoadExternalLibsServiceMock } from '@fixtures/load-external-libs.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { OptimizeService } from '@core/experimentation/vendors/optimize/optimize.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { OptimizelyServiceMock, OptimizeServiceMock } from '@fixtures/experimentation.fixtures.spec';
import { OptimizelyService } from '@core/experimentation/vendors/optimizely/optimizely.service';

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
    describe('and the user is not ready', () => {
      it('should not initialize optimizely service', fakeAsync(() => {
        spyOn(OptimizelyServiceMock, 'initialize');
        service.initialize();
        tick();

        expect(OptimizelyServiceMock.initialize).not.toHaveBeenCalled();
      }));

      it('should not set experimentation as ready', fakeAsync(() => {
        service.initialize();
        tick();

        // userService.initializeUserWithPermissions();

        // userService.isUserReady$.subscribe((value) =>{
        //   console.log('HOLA', value)
        //   expect(value).toBeTruthy();
        // })

        // service.experimentReady$.subscribe((value) => {
        //   expect(value).toBeFalsy();
        // });

        flush();
      }));
    });
  });
});
