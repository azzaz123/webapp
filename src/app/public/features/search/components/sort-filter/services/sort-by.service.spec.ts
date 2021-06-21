import { TestBed } from '@angular/core/testing';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_PARAMETER_STORE_TOKEN } from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { ReplaySubject } from 'rxjs';
import { SORT_BY_RELEVANCE_CATEGORY_IDS } from './constants/sort-by-config-constants';
import { SORT_BY_DEFAULT_OPTIONS, SORT_BY_RELEVANCE_OPTIONS } from './constants/sort-by-options-constants';
import { SortByService } from './sort-by.service';

describe('SortByService', () => {
  let sortByService: SortByService;
  const parametersSubject: ReplaySubject<FilterParameter[]> = new ReplaySubject<FilterParameter[]>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SortByService,
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useValue: {
            parameters$: parametersSubject.asObservable(),
          },
        },
      ],
    });
    sortByService = TestBed.inject(SortByService);
  });

  describe('when filterParameterStore parameters changes', () => {
    describe('and has no parameters', () => {
      it('should update options with sort by default options', () => {
        const parameters: FilterParameter[] = [];
        spyOn(sortByService['optionsSubject'], 'next');
        parametersSubject.next(parameters);

        expect(sortByService['optionsSubject'].next).toHaveBeenCalledWith(SORT_BY_DEFAULT_OPTIONS);
      });
    });

    describe('and has parameters', () => {
      let parameters: FilterParameter[];

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

          it('should update options with sort by relevance options', () => {
            spyOn(sortByService['optionsSubject'], 'next');
            parametersSubject.next(parameters);

            expect(sortByService['optionsSubject'].next).toHaveBeenCalledWith(SORT_BY_RELEVANCE_OPTIONS);
          });
        });

        describe('and has NOT keyword', () => {
          it('should update options with sort by default options', () => {
            spyOn(sortByService['optionsSubject'], 'next');
            parametersSubject.next(parameters);

            expect(sortByService['optionsSubject'].next).toHaveBeenCalledWith(SORT_BY_DEFAULT_OPTIONS);
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
          const parameters: FilterParameter[] = [];
          spyOn(sortByService['optionsSubject'], 'next');
          parametersSubject.next(parameters);

          expect(sortByService['optionsSubject'].next).toHaveBeenCalledWith(SORT_BY_DEFAULT_OPTIONS);
        });
      });
    });
  });
});
