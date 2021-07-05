import { TestBed } from '@angular/core/testing';

import { SearchNavigatorService } from './search-navigator.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { FILTER_PARAMETERS_SEARCH } from '@public/features/search/core/services/constants/filter-parameters';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';

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
          provide: 'SUBDOMAIN',
          useValue: 'es',
        },
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

  describe('when asked to navigate', () => {
    describe('and should keep current parameters', () => {
      it('should take current params as part of the set', async () => {
        await router.navigate(['/search'], {
          queryParams: {
            existingParam: 'existingParam',
            [FILTER_QUERY_PARAM_KEY.latitude]: '10',
            [FILTER_QUERY_PARAM_KEY.longitude]: '10',
          },
        });

        spyOn(router, 'navigate');

        service.navigate(
          [
            {
              key: 'otherParam' as FILTER_QUERY_PARAM_KEY,
              value: 'otherParam',
            },
          ],
          filtersource,
          true
        );

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/search'], {
          queryParams: {
            existingParam: 'existingParam',
            [FILTER_QUERY_PARAM_KEY.latitude]: '10',
            [FILTER_QUERY_PARAM_KEY.longitude]: '10',
            otherParam: 'otherParam',
            [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersource,
          },
        });
      });
    });

    describe('and should overwrite existing parameters', () => {
      it('should not take current params as part of the set', async () => {
        await router.navigate(['/search'], {
          queryParams: {
            existingParam: 'existingParam',
            [FILTER_QUERY_PARAM_KEY.latitude]: '10',
            [FILTER_QUERY_PARAM_KEY.longitude]: '10',
          },
        });

        spyOn(router, 'navigate');

        service.navigate(
          [
            {
              key: 'otherParam' as FILTER_QUERY_PARAM_KEY,
              value: 'otherParam',
            },
          ],
          filtersource
        );

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/search'], {
          queryParams: {
            [FILTER_QUERY_PARAM_KEY.latitude]: '10',
            [FILTER_QUERY_PARAM_KEY.longitude]: '10',
            otherParam: 'otherParam',
            [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersource,
          },
        });
      });
    });

    describe('and clean is required', () => {
      describe('due to a category change', () => {
        it('should clean the parameters', async () => {
          await router.navigate(['/search'], {
            queryParams: {
              [FILTER_QUERY_PARAM_KEY.categoryId]: '100',
              other_param: 'otherParam',
              [FILTER_QUERY_PARAM_KEY.latitude]: '10',
              [FILTER_QUERY_PARAM_KEY.longitude]: '10',
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
                key: 'other_param' as FILTER_QUERY_PARAM_KEY,
                value: 'otherParam',
              },
            ],
            filtersource
          );

          expect(router.navigate).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith(['/search'], {
            queryParams: {
              [FILTER_QUERY_PARAM_KEY.categoryId]: '200',
              [FILTER_QUERY_PARAM_KEY.latitude]: '10',
              [FILTER_QUERY_PARAM_KEY.longitude]: '10',
              [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersource,
            },
          });
        });
      });

      describe('due to a change in real estate parameters', () => {
        it('should clean the parameters', async () => {
          await router.navigate(['/search'], {
            queryParams: {
              [FILTER_QUERY_PARAM_KEY.categoryId]: '200',
              [FILTER_QUERY_PARAM_KEY.minPrice]: '200',
              [FILTER_QUERY_PARAM_KEY.operation]: 'buy',
              [FILTER_QUERY_PARAM_KEY.type]: 'house',
              [FILTER_QUERY_PARAM_KEY.latitude]: '10',
              [FILTER_QUERY_PARAM_KEY.longitude]: '10',
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
              [FILTER_QUERY_PARAM_KEY.latitude]: '10',
              [FILTER_QUERY_PARAM_KEY.longitude]: '10',
              [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersource,
            },
          });
        });
      });

      describe('and non automatically cleanable param is present', () => {
        describe('explicitly cleaned on the navigate', () => {
          it('should clear the param', async () => {
            await router.navigate(['/search'], {
              queryParams: {
                [FILTER_QUERY_PARAM_KEY.categoryId]: '2',
                [FILTER_QUERY_PARAM_KEY.distance]: '10',
                [FILTER_QUERY_PARAM_KEY.latitude]: '10',
                [FILTER_QUERY_PARAM_KEY.longitude]: '10',
              },
            });

            spyOn(router, 'navigate');

            service.navigate(
              [
                {
                  key: FILTER_QUERY_PARAM_KEY.categoryId,
                  value: '4',
                },
                {
                  key: FILTER_QUERY_PARAM_KEY.distance,
                  value: undefined,
                },
              ],
              filtersource
            );

            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith(['/search'], {
              queryParams: {
                [FILTER_QUERY_PARAM_KEY.categoryId]: '4',
                [FILTER_QUERY_PARAM_KEY.latitude]: '10',
                [FILTER_QUERY_PARAM_KEY.longitude]: '10',
                [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersource,
              },
            });
          });

          describe('and clean params are location', () => {
            it('should inject next priority location', async () => {
              await router.navigate(['/search'], {
                queryParams: {
                  [FILTER_QUERY_PARAM_KEY.categoryId]: '2',
                  [FILTER_QUERY_PARAM_KEY.latitude]: '10',
                  [FILTER_QUERY_PARAM_KEY.longitude]: '10',
                },
              });

              spyOn(router, 'navigate');

              service.navigate(
                [
                  {
                    key: FILTER_QUERY_PARAM_KEY.categoryId,
                    value: '4',
                  },
                  {
                    key: FILTER_QUERY_PARAM_KEY.longitude,
                    value: undefined,
                  },
                  {
                    key: FILTER_QUERY_PARAM_KEY.latitude,
                    value: undefined,
                  },
                ],
                filtersource
              );

              expect(router.navigate).toHaveBeenCalledTimes(1);
              expect(router.navigate).toHaveBeenCalledWith(['/search'], {
                queryParams: {
                  [FILTER_QUERY_PARAM_KEY.categoryId]: '4',
                  [FILTER_QUERY_PARAM_KEY.latitude]: DEFAULT_LOCATIONS.en.latitude,
                  [FILTER_QUERY_PARAM_KEY.longitude]: DEFAULT_LOCATIONS.en.longitude,
                  [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersource,
                },
              });
            });
          });
        });

        describe('not explicitly cleaned on the navigate', () => {
          it('should not clear the param', async () => {
            await router.navigate(['/search'], {
              queryParams: {
                [FILTER_QUERY_PARAM_KEY.categoryId]: '2',
                [FILTER_QUERY_PARAM_KEY.latitude]: '10',
                [FILTER_QUERY_PARAM_KEY.longitude]: '10',
              },
            });

            spyOn(router, 'navigate');

            service.navigate(
              [
                {
                  key: FILTER_QUERY_PARAM_KEY.categoryId,
                  value: '4',
                },
              ],
              filtersource
            );

            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith(['/search'], {
              queryParams: {
                [FILTER_QUERY_PARAM_KEY.categoryId]: '4',
                [FILTER_QUERY_PARAM_KEY.latitude]: '10',
                [FILTER_QUERY_PARAM_KEY.longitude]: '10',
                [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersource,
              },
            });
          });
        });
      });
    });
  });
});
