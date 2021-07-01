import { TestBed } from '@angular/core/testing';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_PARAMETER_STORE_TOKEN } from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { of, ReplaySubject } from 'rxjs';
import { SORT_BY_RELEVANCE_CATEGORY_IDS } from './constants/sort-by-config-constants';
import { SORT_BY_DEFAULT_OPTIONS, SORT_BY_RELEVANCE_OPTIONS } from './constants/sort-by-options-constants';
import { SortByService } from './sort-by.service';

describe('SortByService', () => {
  let featureFlagService: FeatureFlagService;
  let sortByService: SortByService;
  const parametersSubject: ReplaySubject<FilterParameter[]> = new ReplaySubject<FilterParameter[]>();
  let parameters = [];
  const optionsSubjectName = 'optionsSubject';
  const isRelevanceOptionActiveSubjectName = 'isRelevanceOptionActiveSubject';
  const getParametersByKeys = (keys: FILTER_QUERY_PARAM_KEY[]) => {
    return parameters.filter((parameter) => keys.includes(parameter.key));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SortByService,
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useValue: {
            parameters$: parametersSubject.asObservable(),
            getParametersByKeys: getParametersByKeys,
          },
        },
        {
          provide: FeatureFlagService,
          useValue: {
            getFlag() {
              return of();
            },
          },
        },
      ],
    });
    sortByService = TestBed.inject(SortByService);
    featureFlagService = TestBed.inject(FeatureFlagService);
  });

  describe('when search filters changes', () => {
    describe('and has no parameters', () => {
      it('should update options with sort by default options', () => {
        spyOn(sortByService[optionsSubjectName], 'next');

        parametersSubject.next(parameters);

        expect(sortByService[optionsSubjectName].next).toHaveBeenCalledWith(SORT_BY_DEFAULT_OPTIONS);
      });

      it('should update isRelevanceOptionActive with false', () => {
        spyOn(sortByService[isRelevanceOptionActiveSubjectName], 'next');

        parametersSubject.next(parameters);

        expect(sortByService[isRelevanceOptionActiveSubjectName].next).toHaveBeenCalledWith(false);
      });
    });

    describe('and has parameters', () => {
      describe('and category id matches relevance option availability', () => {
        beforeEach(() => {
          parameters = [
            {
              key: FILTER_QUERY_PARAM_KEY.categoryId,
              value: SORT_BY_RELEVANCE_CATEGORY_IDS[0].toString(),
            },
          ];
        });
        describe('and has keyword', () => {
          beforeEach(() => {
            parameters.push({
              key: FILTER_QUERY_PARAM_KEY.keywords,
              value: 'keywords',
            });
          });

          describe('and feature flag is active', () => {
            beforeEach(() => {
              sortByService['isRelevanceFeatureFlagActive'] = true;
            });

            it('should update options with sort by relevance options', () => {
              spyOn(sortByService[optionsSubjectName], 'next');
              parametersSubject.next(parameters);

              expect(sortByService[optionsSubjectName].next).toHaveBeenCalledWith(SORT_BY_RELEVANCE_OPTIONS);
            });

            it('should update isRelevanceOptionActive with true', () => {
              spyOn(sortByService[isRelevanceOptionActiveSubjectName], 'next');

              parametersSubject.next(parameters);

              expect(sortByService[isRelevanceOptionActiveSubjectName].next).toHaveBeenCalledWith(true);
            });
          });

          describe('and feature flag is NOT active', () => {
            beforeEach(() => {
              sortByService['isRelevanceFeatureFlagActive'] = false;
            });

            it('should update options with sort by default options', () => {
              spyOn(sortByService[optionsSubjectName], 'next');

              parametersSubject.next(parameters);

              expect(sortByService[optionsSubjectName].next).toHaveBeenCalledWith(SORT_BY_DEFAULT_OPTIONS);
            });

            it('should update isRelevanceOptionActive with false', () => {
              spyOn(sortByService[isRelevanceOptionActiveSubjectName], 'next');

              parametersSubject.next(parameters);

              expect(sortByService[isRelevanceOptionActiveSubjectName].next).toHaveBeenCalledWith(false);
            });
          });
        });

        describe('and has NOT keyword', () => {
          it('should update options with sort by default options', () => {
            spyOn(sortByService[optionsSubjectName], 'next');
            parametersSubject.next(parameters);

            expect(sortByService[optionsSubjectName].next).toHaveBeenCalledWith(SORT_BY_DEFAULT_OPTIONS);
          });

          it('should update isRelevanceOptionActive with false', () => {
            spyOn(sortByService[isRelevanceOptionActiveSubjectName], 'next');

            parametersSubject.next(parameters);

            expect(sortByService[isRelevanceOptionActiveSubjectName].next).toHaveBeenCalledWith(false);
          });
        });
      });

      describe('and do NOT match with relevance option availability', () => {
        beforeEach(() => {
          parameters = [
            {
              key: FILTER_QUERY_PARAM_KEY.categoryId,
              value: CATEGORY_IDS.CAR.toString(),
            },
          ];
        });

        it('should update options with sort by default options', () => {
          spyOn(sortByService[optionsSubjectName], 'next');
          parametersSubject.next(parameters);

          expect(sortByService[optionsSubjectName].next).toHaveBeenCalledWith(SORT_BY_DEFAULT_OPTIONS);
        });

        it('should update isRelevanceOptionActive with false', () => {
          spyOn(sortByService[isRelevanceOptionActiveSubjectName], 'next');

          parametersSubject.next(parameters);

          expect(sortByService[isRelevanceOptionActiveSubjectName].next).toHaveBeenCalledWith(false);
        });
      });
    });
  });
});
