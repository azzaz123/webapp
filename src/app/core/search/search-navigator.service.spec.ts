import { TestBed } from '@angular/core/testing';

import { SearchNavigatorService } from './search-navigator.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Params, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { FILTER_PARAMETERS_SEARCH } from '@public/features/search/core/services/constants/filter-parameters';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { PUBLIC_PATHS } from '@public/public-routing-constants';

@Component({
  selector: 'tsl-blank',
  template: '',
})
class BlankComponent {}

describe('SearchNavigatorService', () => {
  let service: SearchNavigatorService;
  let router: Router;
  const filtersource = FILTERS_SOURCE.QUICK_FILTERS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'search',
            component: BlankComponent,
          },
        ]),
      ],
      declarations: [BlankComponent],
      providers: [
        SearchQueryStringService,
        QueryStringLocationService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });
    service = TestBed.inject(SearchNavigatorService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when applying new search filters', () => {
    const MOCK_PARAMS: FilterParameter[] = [
      { key: FILTER_QUERY_PARAM_KEY.keywords, value: 'OnePlus One' },
      { key: FILTER_QUERY_PARAM_KEY.categoryId, value: `${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}` },
      { key: FILTER_QUERY_PARAM_KEY.minPrice, value: `${200}` },
      { key: FILTER_QUERY_PARAM_KEY.maxPrice, value: undefined },
    ];

    const MOCK_QUERY_PARAMS: Params = {
      [FILTER_QUERY_PARAM_KEY.keywords]: 'OnePlus One',
      [FILTER_QUERY_PARAM_KEY.categoryId]: `${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}`,
      [FILTER_QUERY_PARAM_KEY.minPrice]: `${200}`,
    };

    describe('and the change comes from the filters Drawer (filtersSource = DEFAULT_FILTERS)', () => {
      it('should apply all search params that do not have an undefined value', () => {
        const expectedQueryParams = {
          ...MOCK_QUERY_PARAMS,
          [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: FILTERS_SOURCE.DEFAULT_FILTERS,
        };
        spyOn(router, 'navigate');

        service.navigate(MOCK_PARAMS, FILTERS_SOURCE.DEFAULT_FILTERS);

        expect(router.navigate).toHaveBeenCalledWith([`/${PUBLIC_PATHS.SEARCH}`], {
          queryParams: expectedQueryParams,
        });
      });
    });

    describe('and the change comes from other source different than the Drawer (search box, quick filters...)', () => {
      beforeEach(async () => {
        await router.navigate([`/${PUBLIC_PATHS.SEARCH}`], {
          queryParams: MOCK_QUERY_PARAMS,
        });
      });

      describe('and the search category is the same than the previous search category', () => {
        it('should apply all search params taking into account current ones and clearing undefined values', () => {
          const expectedQueryParams = {
            ...MOCK_QUERY_PARAMS,
            [FILTER_QUERY_PARAM_KEY.condition]: 'As good as new',
            [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: FILTERS_SOURCE.QUICK_FILTERS,
          };
          const newParams = [{ key: FILTER_QUERY_PARAM_KEY.condition, value: 'As good as new' }];
          spyOn(router, 'navigate');

          service.navigate(newParams, FILTERS_SOURCE.QUICK_FILTERS);

          expect(router.navigate).toHaveBeenCalledWith([`/${PUBLIC_PATHS.SEARCH}`], {
            queryParams: expectedQueryParams,
          });
        });
      });

      describe('and the search category is different than the previous search category', () => {
        it('should clear all parameters that cannot be maintained after a category change', () => {
          const expectedQueryParams = {
            [FILTER_QUERY_PARAM_KEY.keywords]: 'OnePlus One',
            [FILTER_QUERY_PARAM_KEY.categoryId]: `${CATEGORY_IDS.MOTORBIKE}`,
            [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: FILTERS_SOURCE.QUICK_FILTERS,
          };
          const newParams = [{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: `${CATEGORY_IDS.MOTORBIKE}` }];
          spyOn(router, 'navigate');

          service.navigate(newParams, FILTERS_SOURCE.QUICK_FILTERS);

          expect(router.navigate).toHaveBeenCalledWith([`/${PUBLIC_PATHS.SEARCH}`], {
            queryParams: expectedQueryParams,
          });
        });
      });

      describe('and the search category is real estate', () => {
        it('should clean the real estate params that can change', async () => {
          await router.navigate(['/search'], {
            queryParams: {
              [FILTER_QUERY_PARAM_KEY.categoryId]: '200',
              [FILTER_QUERY_PARAM_KEY.minPrice]: '200',
              [FILTER_QUERY_PARAM_KEY.operation]: 'buy',
              [FILTER_QUERY_PARAM_KEY.type]: 'house',
            },
          });

          spyOn(router, 'navigate');

          service.navigate(
            [
              {
                key: FILTER_QUERY_PARAM_KEY.categoryId,
                value: '200',
              },
              {
                key: FILTER_QUERY_PARAM_KEY.type,
                value: 'house',
              },
              {
                key: FILTER_QUERY_PARAM_KEY.minPrice,
                value: '200',
              },
              {
                key: FILTER_QUERY_PARAM_KEY.operation,
                value: 'rent',
              },
            ],
            filtersource
          );

          expect(router.navigate).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith(['/search'], {
            queryParams: {
              [FILTER_QUERY_PARAM_KEY.categoryId]: '200',
              [FILTER_QUERY_PARAM_KEY.operation]: 'rent',
              [FILTER_QUERY_PARAM_KEY.type]: 'house',
              [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersource,
            },
          });
        });
      });
    });
  });
});
