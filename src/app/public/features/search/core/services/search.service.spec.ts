import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { filterParametersMock } from '@fixtures/filter-parameter.fixtures';
import { SearchPaginationFactory } from '@fixtures/search-items.fixtures';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { of } from 'rxjs';
import { SearchItem } from '../../interfaces/search-item.interface';
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

  beforeEach(() => {
    searchStoreServiceMock = {
      setItems: (items: SearchItem[]) => {},
      appendItems: (items: SearchItem[]) => {},
    };

    filterParameterStoreServiceMock = {
      parameters$: of(filterParametersMock),
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

  describe('when we want to search', () => {
    it('should get the parameters to search with that parameters', () => {
      spyOn(searchInfrastructureServiceMock, 'search').and.callThrough();

      service.search();

      expect(searchInfrastructureServiceMock.search).toHaveBeenCalledWith(filterParametersMock);
      expect(searchInfrastructureServiceMock.search).toHaveBeenCalledTimes(1);
    });

    it('should set item on search store by search response', fakeAsync(() => {
      const searchPagination: SearchPagination = SearchPaginationFactory();
      spyOn(searchInfrastructureServiceMock, 'search').and.returnValue(of(searchPagination));
      spyOn(searchStoreServiceMock, 'setItems').and.callThrough();

      service.search();
      tick(10000);

      expect(searchStoreServiceMock.setItems).toHaveBeenCalledWith(searchPagination.items);
      expect(searchStoreServiceMock.setItems).toHaveBeenCalledTimes(1);
    }));
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
