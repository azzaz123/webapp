import { TestBed } from '@angular/core/testing';
import { filterParametersMock } from '@fixtures/filter-parameter.fixtures';
import { SearchPaginationFactory } from '@fixtures/item-card.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { BehaviorSubject, of } from 'rxjs';
import { SearchPagination } from '../../interfaces/search-pagination.interface';
import { FilterParameterStoreService } from './filter-parameter-store.service';
import { SearchInfrastructureService } from './infrastructure/search-infrastructure.service';
import { SearchStoreService } from './search-store.service';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let searchStoreServiceMock;
  let filterParameterStoreServiceMock;
  let searchInfrastructureServiceMock;
  const filterParametersSubject: BehaviorSubject<FilterParameter[]> = new BehaviorSubject<FilterParameter[]>([]);
  const itemsSubject: BehaviorSubject<ItemCard[]> = new BehaviorSubject<ItemCard[]>([]);

  beforeEach(() => {
    searchStoreServiceMock = {
      items$: itemsSubject.asObservable(),
      setItems: (items: ItemCard[]) => {},
      appendItems: (items: ItemCard[]) => {},
    };

    filterParameterStoreServiceMock = {
      parameters$: filterParametersSubject.asObservable(),
    };

    searchInfrastructureServiceMock = {
      search: (params: FilterParameter) => of(SearchPaginationFactory()),
      loadMore: () => of(SearchPaginationFactory()),
    };

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        {
          provide: SearchStoreService,
          useValue: searchStoreServiceMock,
        },
        {
          provide: FilterParameterStoreService,
          useValue: filterParameterStoreServiceMock,
        },
        {
          provide: SearchInfrastructureService,
          useValue: searchInfrastructureServiceMock,
        },
      ],
    });

    service = TestBed.inject(SearchService);
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
      it('should get items by search infrastructure', () => {
        spyOn(searchInfrastructureServiceMock, 'search').and.callThrough();

        filterParametersSubject.next(filterParametersMock);

        expect(searchInfrastructureServiceMock.search).toHaveBeenCalledTimes(1);
        expect(searchInfrastructureServiceMock.search).toHaveBeenCalledWith(filterParametersMock);
      });
    });

    describe('when we want to load more', () => {
      it('should load more on search infrastructure', () => {
        spyOn(searchInfrastructureServiceMock, 'loadMore').and.callThrough();

        service.loadMore();

        expect(searchInfrastructureServiceMock.loadMore).toHaveBeenCalledWith();
        expect(searchInfrastructureServiceMock.loadMore).toHaveBeenCalledTimes(1);
      });

      it('should append items on search store by load more response', () => {
        const searchPagination: SearchPagination = SearchPaginationFactory();
        spyOn(searchInfrastructureServiceMock, 'loadMore').and.returnValue(of(searchPagination));
        spyOn(searchStoreServiceMock, 'appendItems').and.callThrough();

        service.loadMore();

        expect(searchStoreServiceMock.appendItems).toHaveBeenCalledWith(searchPagination.items);
        expect(searchStoreServiceMock.appendItems).toHaveBeenCalledTimes(1);
      });
    });
  });
});
