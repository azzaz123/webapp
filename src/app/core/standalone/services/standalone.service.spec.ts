import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StandaloneService } from './standalone.service';
import { STANDALONE_STATUS } from '@core/standalone/enums/standalone-status.enum';
import { MOCK_HUAWEI_USER_AGENT, MOCK_MACOS_USER_AGENT } from '@fixtures/user-agent.fixtures.spec';

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

  describe('Standalone', () => {
    describe('when the user is on a huawei device', () => {
      beforeEach(() => {
        Object.defineProperty(window.navigator, 'userAgent', { value: MOCK_HUAWEI_USER_AGENT });
      });
      describe('and the standalone query param is set as true', () => {
        it('should enable the standalone mode', (done) => {
          service = TestBed.inject(StandaloneService);

          service.standalone$.subscribe((value: boolean) => {
            expect(value).toBe(true);
            done();
          });
        });
      });
      describe('and the standalone query param is NOT set as true', () => {
        it('should enable the standalone mode', (done) => {
          spyOn(route.snapshot.queryParamMap, 'get').and.returnValue('false');

          service = TestBed.inject(StandaloneService);

          service.standalone$.subscribe((value: boolean) => {
            expect(value).toBe(true);
            done();
          });
        });
      });
    });
    describe('when the user is NOT on a huawei device', () => {
      beforeEach(() => {
        Object.defineProperty(window.navigator, 'userAgent', { value: MOCK_MACOS_USER_AGENT });
      });
      describe('and the standalone query param is set as true', () => {
        it('should enable the standalone mode', (done) => {
          service = TestBed.inject(StandaloneService);

          service.standalone$.subscribe((value: boolean) => {
            expect(value).toBe(true);
            done();
          });
        });
      });
      describe('and the standalone query param is NOT set as true', () => {
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
  });
});
