import { TestBed } from '@angular/core/testing';
import { filterParametersMock, filterParametersMockWithCategory } from '@fixtures/filter-parameter.fixtures';
import { SearchPaginationFactory } from '@fixtures/item-card.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { of, Subject } from 'rxjs';
import { SearchPagination } from '../../interfaces/search-pagination.interface';
import { SearchInfrastructureService } from './infrastructure/search-infrastructure.service';
import { SearchStoreService } from './search-store.service';
import { SearchService } from './search.service';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SearchQueryStringService } from '@public/features/search/core/services/search-query-string.service';
import { QueryStringLocationService } from '@public/features/search/core/services/query-string-location.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { MOCK_SEARCH_ID } from './search-list-tracking-events.fixtures.spec';

describe('SearchService', () => {
  let service: SearchService;
  let searchStoreServiceMock;
  let filterParameterStoreServiceMock;
  let searchInfrastructureServiceMock;
  let queryStringServiceMock;
  let queryStringLocationService: QueryStringLocationService;

  const filterParametersSubject: Subject<FilterParameter[]> = new Subject<FilterParameter[]>();
  const itemsSubject: Subject<ItemCard[]> = new Subject<ItemCard[]>();
  const hasMoreSubject: Subject<boolean> = new Subject<boolean>();
  const queryParamsSubject: Subject<FilterParameter[]> = new Subject<FilterParameter[]>();

  beforeEach(() => {
    searchStoreServiceMock = {
      items$: itemsSubject.asObservable(),
      hasMore$: hasMoreSubject.asObservable(),
      setItems: (items: ItemCard[]) => {},
      setHasMore: (hasMore: boolean) => {},
      appendItems: (items: ItemCard[]) => {},
      clear: () => {},
    };

    filterParameterStoreServiceMock = {
      parameters$: filterParametersSubject.asObservable(),
      setParameters: () => {},
      clear: () => {},
    };

    searchInfrastructureServiceMock = {
      getSearchId: () => MOCK_SEARCH_ID,
      search: (params: FilterParameter) => of(SearchPaginationFactory()),
      loadMore: () => of(SearchPaginationFactory()),
    };

    queryStringServiceMock = {
      queryStringParams$: queryParamsSubject.asObservable(),
      setQueryParams: () => {},
    };

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        {
          provide: SearchStoreService,
          useValue: searchStoreServiceMock,
        },
        {
          provide: SearchInfrastructureService,
          useValue: searchInfrastructureServiceMock,
        },
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useValue: filterParameterStoreServiceMock,
        },
        {
          provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
          useValue: filterParameterStoreServiceMock,
        },
        {
          provide: SearchQueryStringService,
          useValue: queryStringServiceMock,
        },
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

    service = TestBed.inject(SearchService);
    queryStringLocationService = TestBed.inject(QueryStringLocationService);
  });

  describe('when service initialize', () => {
    beforeEach(() => {
      service.init();
    });
    describe('without any change of parameters', () => {
      it('should call to search with empty filters', () => {
        spyOn(searchInfrastructureServiceMock, 'search').and.callThrough();

        filterParametersSubject.next([]);

        expect(searchInfrastructureServiceMock.search).toHaveBeenCalledTimes(1);
        expect(searchInfrastructureServiceMock.search).toHaveBeenCalledWith([]);
      });
    });

    describe('and change the parameters', () => {
      it('should get items by search infrastructure and set searchId', () => {
        spyOn(searchInfrastructureServiceMock, 'search').and.callThrough();

        filterParametersSubject.next(filterParametersMock);

        service.searchId$.subscribe((searchId: string) => {
          expect(searchId).toEqual(MOCK_SEARCH_ID);
        });
        expect(searchInfrastructureServiceMock.search).toHaveBeenCalledTimes(1);
        expect(searchInfrastructureServiceMock.search).toHaveBeenCalledWith(filterParametersMock);
      });

      it('should enable the loading state', () => {
        spyOn(searchInfrastructureServiceMock, 'search').and.callThrough();

        filterParametersSubject.next(filterParametersMock);
        service.isLoadingResults$.subscribe((isLoading: boolean) => {
          expect(isLoading).toEqual(true);
        });
      });

      it('should save items and set has more if there has more', () => {
        const searchPagination: SearchPagination = SearchPaginationFactory();
        spyOn(searchInfrastructureServiceMock, 'search').and.returnValue(of(searchPagination));
        spyOn(searchStoreServiceMock, 'setItems').and.callThrough();
        spyOn(searchStoreServiceMock, 'setHasMore').and.callThrough();

        filterParametersSubject.next(filterParametersMock);

        expect(searchStoreServiceMock.setItems).toHaveBeenCalledTimes(1);
        expect(searchStoreServiceMock.setItems).toHaveBeenCalledWith(searchPagination.items);
        expect(searchStoreServiceMock.setHasMore).toHaveBeenCalledTimes(1);
        expect(searchStoreServiceMock.setHasMore).toHaveBeenCalledWith(searchPagination.hasMore);
      });

      describe('when it has finished loading', () => {
        it('should disable the loading state', (done) => {
          spyOn(searchInfrastructureServiceMock, 'search').and.callThrough();

          filterParametersSubject.next(filterParametersMock);
          service.isLoadingResults$.subscribe((isLoading: boolean) => {
            expect(isLoading).toEqual(false);
            done();
          });
        });

        it('should set the state for the new category', (done) => {
          const expectedCategoryId = filterParametersMockWithCategory.find((param) => param.key === FILTER_QUERY_PARAM_KEY.categoryId)
            ?.value;

          spyOn(searchInfrastructureServiceMock, 'search').and.callThrough();

          filterParametersSubject.next(filterParametersMockWithCategory);
          service.currentCategoryId$.subscribe((categoryId: string) => {
            expect(categoryId).toEqual(expectedCategoryId);
            done();
          });
        });
      });
    });

    describe('when we want to load more', () => {
      it('should load more on search infrastructure', () => {
        spyOn(searchInfrastructureServiceMock, 'loadMore').and.callThrough();

        service.loadMore();

        expect(searchInfrastructureServiceMock.loadMore).toHaveBeenCalledWith();
        expect(searchInfrastructureServiceMock.loadMore).toHaveBeenCalledTimes(1);
      });

      it('should append items on search store by load more response and set if there has more items', () => {
        const searchPagination: SearchPagination = SearchPaginationFactory();
        spyOn(searchInfrastructureServiceMock, 'loadMore').and.returnValue(of(searchPagination));
        spyOn(searchStoreServiceMock, 'appendItems').and.callThrough();
        spyOn(searchStoreServiceMock, 'setHasMore').and.callThrough();

        service.loadMore();

        expect(searchStoreServiceMock.appendItems).toHaveBeenCalledWith(searchPagination.items);
        expect(searchStoreServiceMock.appendItems).toHaveBeenCalledTimes(1);
        expect(searchStoreServiceMock.setHasMore).toHaveBeenCalledTimes(1);
        expect(searchStoreServiceMock.setHasMore).toHaveBeenCalledWith(searchPagination.hasMore);
      });
    });
  });

  describe('when we want to close', () => {
    it('should clear all services', () => {
      spyOn(searchStoreServiceMock, 'clear').and.callThrough();
      spyOn(filterParameterStoreServiceMock, 'clear').and.callThrough();

      service.close();

      expect(searchStoreServiceMock.clear).toHaveBeenCalledTimes(1);
      expect(filterParameterStoreServiceMock.clear).toHaveBeenCalledTimes(1);
    });

    it('should not listen the changes of filter parameters', () => {
      spyOn(searchInfrastructureServiceMock, 'search').and.callThrough();
      filterParametersSubject.next(filterParametersMock);

      service.close();

      expect(searchInfrastructureServiceMock.search).toHaveBeenCalledTimes(0);
    });
  });

  describe('when we want to get items and has more', () => {
    beforeEach(() => {
      service.init();
    });

    it('should return an observable of items', (done) => {
      const searchPagination: SearchPagination = SearchPaginationFactory();

      service.items$.subscribe((items: ItemCard[]) => {
        expect(items).toEqual(searchPagination.items);
        done();
      });

      itemsSubject.next(searchPagination.items);
    });

    it('should return an observable of hasMore', (done) => {
      const searchPagination: SearchPagination = SearchPaginationFactory();

      service.hasMore$.subscribe((hasMore: boolean) => {
        expect(hasMore).toEqual(searchPagination.hasMore);
        done();
      });

      hasMoreSubject.next(searchPagination.hasMore);
    });
  });

  describe('when query params emits', () => {
    beforeEach(() => {
      service.init();
    });

    describe('for the first time', () => {
      it('should set parameters', () => {
        const defaultLocation = getDefaultLocation('es');
        spyOn(filterParameterStoreServiceMock, 'setParameters');
        spyOn(queryStringLocationService, 'getLocationParameters').and.returnValue(defaultLocation);

        queryParamsSubject.next([]);

        expect(filterParameterStoreServiceMock.setParameters).toHaveBeenCalledTimes(1);
        expect(filterParameterStoreServiceMock.setParameters).toHaveBeenCalledWith([
          {
            key: FILTER_QUERY_PARAM_KEY.longitude,
            value: defaultLocation[FILTER_QUERY_PARAM_KEY.longitude],
          },
          {
            key: FILTER_QUERY_PARAM_KEY.latitude,
            value: defaultLocation[FILTER_QUERY_PARAM_KEY.latitude],
          },
        ]);
      });
    });

    describe('after the first time', () => {
      beforeEach(() => {
        queryParamsSubject.next([]);
      });
      it('should set parameters', () => {
        const newParams = [
          {
            key: FILTER_QUERY_PARAM_KEY.condition,
            value: 'value',
          },
        ];
        spyOn(filterParameterStoreServiceMock, 'setParameters');

        queryParamsSubject.next(newParams);

        expect(filterParameterStoreServiceMock.setParameters).toHaveBeenCalledTimes(1);
        expect(filterParameterStoreServiceMock.setParameters).toHaveBeenCalledWith(newParams);
      });
    });

    function getDefaultLocation(market: string): SearchLocation {
      return DEFAULT_LOCATIONS[market];
    }
  });
});
