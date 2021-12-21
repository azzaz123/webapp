import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StandaloneService } from './standalone.service';
import { STANDALONE_STATUS } from '@core/standalone/enums/standalone-status.enum';

describe('StandaloneService', () => {
  let service: StandaloneService;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StandaloneService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => STANDALONE_STATUS.ENABLED,
              },
            },
          },
        },
      ],
    });
    route = TestBed.inject(ActivatedRoute);
  });

  describe('when the app url has a standalone query param set as true', () => {
    it('should enable the standalone mode', (done) => {
      service = TestBed.inject(StandaloneService);

      service.standalone$.subscribe((value: boolean) => {
        expect(value).toBe(true);
        done();
      });
    });
  });
  describe('when the app url has NOT a standalone query param set as true', () => {
    it('should NOT enable the standalone mode', (done) => {
      spyOn(route.snapshot.queryParamMap, 'get').and.returnValue('false');

      service = TestBed.inject(StandaloneService);

      service.standalone$.subscribe((value: boolean) => {
        expect(value).toBe(false);
        done();
      });
    });
  });
});
