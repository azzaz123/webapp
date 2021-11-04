import { TestBed } from '@angular/core/testing';
import { ExperimentationService } from './experimentation.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { LoadExternalLibsServiceMock } from '@fixtures/load-external-libs.fixtures.spec';

describe('ExperimentService', () => {
  let service: ExperimentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoadExternalLibsService,
          useValue: LoadExternalLibsServiceMock,
        },
      ],
    });
    service = TestBed.inject(ExperimentationService);
  });

  describe('initialize', () => {
    it('should load Optimize script on initialize', () => {
      spyOn(LoadExternalLibsServiceMock, 'loadScriptBySource').and.callThrough();

      service.initialize();

      expect(LoadExternalLibsServiceMock.loadScriptBySource).toHaveBeenCalledWith(EXPERIMENTATION_SOURCES);
    });
  });
});
