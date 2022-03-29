import { TestBed } from '@angular/core/testing';
import { Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { YOU_PATHS } from '../constants/you-routing.constants';

import { YouGuard } from './you.guard';

describe('YouGuard', () => {
  let guard: YouGuard;
  let window: Window;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        YouGuard,
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
        {
          provide: WINDOW_TOKEN,
          useValue: {
            matchMedia: () => {
              return {
                matches: false,
              };
            },
          },
        },
      ],
    });
    router = TestBed.inject(Router);
    window = TestBed.inject(WINDOW_TOKEN);
    guard = TestBed.inject(YouGuard);
  });

  describe('when the bottom navigation bar is not visible', () => {
    describe('and the visited route is the root one (/you)', () => {
      it('should not allow access to the route and redirect to the user catalog', () => {
        const MOCK_URL_SEGMENT = new UrlSegment(PRIVATE_PATHS.YOU, {});
        spyOn(router, 'navigate');

        guard.canLoad({}, [MOCK_URL_SEGMENT]);

        expect(router.navigate).toHaveBeenCalledWith([`/${APP_PATHS.PRIVATE}${PRIVATE_PATHS.CATALOG}`]);
      });
    });

    describe('and the visited route is a child one (e.g /you/settings)', () => {
      it('should not allow access to the route and redirect to the child route', () => {
        const MOCK_URL_SEGMENT_YOU = new UrlSegment(PRIVATE_PATHS.YOU, {});
        const MOCK_URL_SEGMENT_SETTINGS = new UrlSegment(YOU_PATHS.SETTINGS, {});

        spyOn(router, 'navigate');

        guard.canLoad({}, [MOCK_URL_SEGMENT_YOU, MOCK_URL_SEGMENT_SETTINGS]);

        expect(router.navigate).toHaveBeenCalledWith([`/${YOU_PATHS.SETTINGS}`]);
      });
    });
  });

  describe('when the bottom navigation bar is visible', () => {
    it('should allow access to the route', () => {
      const MOCK_URL_SEGMENT = new UrlSegment(PRIVATE_PATHS.YOU, {});
      spyOn(window, 'matchMedia').and.returnValue({ matches: true });

      const canLoad = guard.canLoad({}, [MOCK_URL_SEGMENT]);

      expect(canLoad).toBe(true);
    });
  });
});
