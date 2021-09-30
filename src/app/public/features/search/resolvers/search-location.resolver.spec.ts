import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { CoordinateMother } from '@fixtures/core';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

import { SearchLocationResolver } from './search-location.resolver';

describe('SearchLocationResolver', () => {
  const MOCK_COORDINATE = CoordinateMother.random();
  let resolver: SearchLocationResolver;
  let route: ActivatedRouteSnapshot;
  let searchNavigatorService: SearchNavigatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchLocationResolver,
        {
          provide: SearchNavigatorService,
          useValue: {
            addLocationParams: () => {},
          },
        },
      ],
    });
    resolver = TestBed.inject(SearchLocationResolver);
    route = new ActivatedRouteSnapshot();
    searchNavigatorService = TestBed.inject(SearchNavigatorService);
  });

  describe('when the route contains location parameters (latitude & longitude)', () => {
    it('should not add location params to the route', () => {
      route.queryParams = {
        [FILTER_QUERY_PARAM_KEY.categoryId]: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        [FILTER_QUERY_PARAM_KEY.latitude]: MOCK_COORDINATE.latitude,
        [FILTER_QUERY_PARAM_KEY.longitude]: MOCK_COORDINATE.longitude,
      };
      spyOn(searchNavigatorService, 'addLocationParams');

      resolver.resolve(route);

      expect(searchNavigatorService.addLocationParams).not.toHaveBeenCalled();
    });
  });

  describe('when the route is missing location params (latitude & longitude)', () => {
    it('should add location params to the route', () => {
      const MOCK_QUERY_PARAMS = {
        [FILTER_QUERY_PARAM_KEY.categoryId]: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
      };
      route.queryParams = MOCK_QUERY_PARAMS;
      spyOn(searchNavigatorService, 'addLocationParams');

      resolver.resolve(route);

      expect(searchNavigatorService.addLocationParams).toHaveBeenCalledWith(MOCK_QUERY_PARAMS);
    });
  });

  describe('when the route is missing longitude param', () => {
    it('should add location params to the route', () => {
      const MOCK_QUERY_PARAMS = {
        [FILTER_QUERY_PARAM_KEY.categoryId]: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        [FILTER_QUERY_PARAM_KEY.latitude]: MOCK_COORDINATE.latitude,
      };
      route.queryParams = MOCK_QUERY_PARAMS;
      spyOn(searchNavigatorService, 'addLocationParams');

      resolver.resolve(route);

      expect(searchNavigatorService.addLocationParams).toHaveBeenCalledWith(MOCK_QUERY_PARAMS);
    });
  });

  describe('when the route is missing latitude param', () => {
    it('should add location params to the route', () => {
      const MOCK_QUERY_PARAMS = {
        [FILTER_QUERY_PARAM_KEY.categoryId]: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        [FILTER_QUERY_PARAM_KEY.longitude]: MOCK_COORDINATE.longitude,
      };
      route.queryParams = MOCK_QUERY_PARAMS;
      spyOn(searchNavigatorService, 'addLocationParams');

      resolver.resolve(route);

      expect(searchNavigatorService.addLocationParams).toHaveBeenCalledWith(MOCK_QUERY_PARAMS);
    });
  });
});
