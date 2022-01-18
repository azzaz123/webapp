import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StandaloneService } from './standalone.service';
import { STANDALONE_STATUS } from '@core/standalone/enums/standalone-status.enum';
import { MOCK_HUAWEI_USER_AGENT, MOCK_MACOS_USER_AGENT } from '@fixtures/user-agent.fixtures.spec';
import { USER_AGENT } from '@core/user-agent/user-agent';
import { WINDOW_TOKEN } from '@core/window/window.token';

describe('StandaloneService', () => {
  let service: StandaloneService;
  let route: ActivatedRoute;
  let userAgentMock = MOCK_MACOS_USER_AGENT;
  let windowMock = {
    matchMedia() {
      return {
        matches: false,
      };
    },
  };

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
        {
          provide: USER_AGENT,
          useValue: userAgentMock,
        },
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
      ],
    });
    route = TestBed.inject(ActivatedRoute);
  });

  describe('Standalone', () => {
    describe('when the user is on a huawei device', () => {
      beforeAll(() => {
        userAgentMock = MOCK_HUAWEI_USER_AGENT;
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
      beforeAll(() => {
        userAgentMock = MOCK_MACOS_USER_AGENT;
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
    });

    describe('when the application is running in an standalone window', () => {
      beforeAll(() => {
        userAgentMock = MOCK_MACOS_USER_AGENT;
        windowMock = {
          matchMedia() {
            return {
              matches: true,
            };
          },
        };
      });

      it('should enable standalone mode', (done) => {
        spyOn(route.snapshot.queryParamMap, 'get').and.returnValue('false');
        service = TestBed.inject(StandaloneService);

        service.standalone$.subscribe((value: boolean) => {
          expect(value).toBe(true);
          done();
        });
      });
    });
  });
});
