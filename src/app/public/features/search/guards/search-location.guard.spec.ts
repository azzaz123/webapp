import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { CoordinateMother } from '@fixtures/core';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SearchLocation } from '../core/services/interfaces/search-location.interface';

import { SearchLocationGuard } from './search-location.guard';

describe('SearchLocationGuard', () => {
  const MOCK_COORDINATE = CoordinateMother.random();
  const MOCK_LATITUDE_LONGITUDE: SearchLocation = {
    [FILTER_QUERY_PARAM_KEY.latitude]: `${MOCK_COORDINATE.latitude}`,
    [FILTER_QUERY_PARAM_KEY.longitude]: `${MOCK_COORDINATE.longitude}`,
  };
  let guard: SearchLocationGuard;
  let route: ActivatedRouteSnapshot;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        SearchLocationGuard,
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
        {
          provide: QueryStringLocationService,
          useValue: {
            getLocationParameters: () => MOCK_LATITUDE_LONGITUDE,
          },
        },
      ],
    });
    route = new ActivatedRouteSnapshot();
    router = TestBed.inject(Router);
    guard = TestBed.inject(SearchLocationGuard);
  });

  describe('when the route contains location parameters (latitude & longitude)', () => {
    it('should not add location params to the route', () => {
      route.queryParams = {
        [FILTER_QUERY_PARAM_KEY.categoryId]: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        [FILTER_QUERY_PARAM_KEY.latitude]: MOCK_COORDINATE.latitude,
        [FILTER_QUERY_PARAM_KEY.longitude]: MOCK_COORDINATE.longitude,
      };
      spyOn(router, 'navigate');

      guard.canActivate(route);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when the route is missing location params (latitude & longitude)', () => {
    it('should add location params to the route', () => {
      const MOCK_QUERY_PARAMS = {
        [FILTER_QUERY_PARAM_KEY.categoryId]: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
      };
      route.queryParams = MOCK_QUERY_PARAMS;
      spyOn(router, 'navigate');

      guard.canActivate(route);

      expect(router.navigate).toHaveBeenCalledWith([`/${PUBLIC_PATHS.SEARCH}`], {
        queryParams: { ...MOCK_QUERY_PARAMS, ...MOCK_LATITUDE_LONGITUDE },
        replaceUrl: true,
      });
    });
  });

  describe('when the route is missing longitude param', () => {
    it('should add location params to the route', () => {
      const MOCK_QUERY_PARAMS = {
        [FILTER_QUERY_PARAM_KEY.categoryId]: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        [FILTER_QUERY_PARAM_KEY.latitude]: MOCK_COORDINATE.latitude,
      };
      route.queryParams = MOCK_QUERY_PARAMS;
      spyOn(router, 'navigate');

      guard.canActivate(route);

      expect(router.navigate).toHaveBeenCalledWith([`/${PUBLIC_PATHS.SEARCH}`], {
        queryParams: { ...MOCK_QUERY_PARAMS, ...MOCK_LATITUDE_LONGITUDE },
        replaceUrl: true,
      });
    });
  });

  describe('when the route is missing latitude param', () => {
    it('should add location params to the route', () => {
      const MOCK_QUERY_PARAMS = {
        [FILTER_QUERY_PARAM_KEY.categoryId]: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        [FILTER_QUERY_PARAM_KEY.longitude]: MOCK_COORDINATE.longitude,
      };
      route.queryParams = MOCK_QUERY_PARAMS;
      spyOn(router, 'navigate');

      guard.canActivate(route);

      expect(router.navigate).toHaveBeenCalledWith([`/${PUBLIC_PATHS.SEARCH}`], {
        queryParams: { ...MOCK_QUERY_PARAMS, ...MOCK_LATITUDE_LONGITUDE },
        replaceUrl: true,
      });
    });
  });
});
