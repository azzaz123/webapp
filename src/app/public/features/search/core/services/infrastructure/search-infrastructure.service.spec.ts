import { TestBed } from '@angular/core/testing';
import { filterParametersMock } from '@fixtures/filter-parameter.fixtures';
import { MOCK_SEARCH_ITEM } from '@fixtures/search-items.fixtures';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { SearchPagination } from '@public/features/search/interfaces/search-pagination.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { of } from 'rxjs';
import { SearchAPIService } from './api/search-api.service';
import { SearchFavouritesService } from './favorites/search-favourites.service';
import { SearchInfrastructureService } from './search-infrastructure.service';

function SearchPaginationFactory(hasMore: boolean = false): SearchPagination {
  return {
    items: new Array(40).fill(MOCK_SEARCH_ITEM),
    hasMore
  };
}

describe('SearchInfrastructureService', () => {
  let service: SearchInfrastructureService;
  let searchApiServiceMock;
  let searchFavouritesServiceMock;

  beforeEach(() => {
    searchApiServiceMock = {
      search: (params: FilterParameter[]) => of(SearchPaginationFactory()),
      loadMore: () => of(SearchPaginationFactory())
    };

    searchFavouritesServiceMock = {
      getFavouritesByItems: (searchItems: SearchItem[]) => of(searchItems)
    };

    TestBed.configureTestingModule({
      providers: [SearchInfrastructureService,
        {
          provide: SearchAPIService,
          useValue: searchApiServiceMock
        },
        {
          provide: SearchFavouritesService,
          useValue: searchFavouritesServiceMock
        }
      ]
    });
    service = TestBed.inject(SearchInfrastructureService);
  });

  describe('when we want to search', () => {
    it('should call to search api to search', () => {
      const filters: FilterParameter[] = filterParametersMock;
      const searchResponse: SearchPagination = SearchPaginationFactory();
      spyOn(searchApiServiceMock, 'search').and.returnValue(of(searchResponse));

      service.search(filters).subscribe();

      expect(searchApiServiceMock.search).toHaveBeenCalledWith(filters);
      expect(searchApiServiceMock.search).toHaveBeenCalledTimes(1);
    });

    it('should receive items and if is has more items or not', (done) => {
      const filters: FilterParameter[] = filterParametersMock;
      const searchResponse: SearchPagination = SearchPaginationFactory();
      spyOn(searchApiServiceMock, 'search').and.returnValue(of(searchResponse));

      service.search(filters).subscribe((response) => {
        expect(response).toEqual(searchResponse);
        done();
      });

      expect(searchApiServiceMock.search).toHaveBeenCalledWith(filters);
      expect(searchApiServiceMock.search).toHaveBeenCalledTimes(1);
    });

    it('should ask the favourites items', (done) => {
      const filters: FilterParameter[] = filterParametersMock;
      const searchResponse: SearchPagination = SearchPaginationFactory();
      const itemsFavourites: SearchItem[] = searchResponse.items.map((item: SearchItem, index: number) => {
        const searchItem: SearchItem = { ...item };
        if (index % 2) {
          searchItem.flags.favourited = true;
        }
        return searchItem;
      });
      spyOn(searchFavouritesServiceMock, 'getFavouritesByItems').and.returnValue(of(itemsFavourites));
      spyOn(searchApiServiceMock, 'search').and.returnValue(of(searchResponse));

      service.search(filters).subscribe((response) => {
        expect(response).toEqual({hasMore: searchResponse.hasMore, items: itemsFavourites});
        done();
      });

      expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledTimes(1);
      expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledWith(searchResponse.items);
    });
  });

  describe('when we want to load more items', () => {
    it('should call to search api to load more', () => {
      const searchResponse: SearchPagination = SearchPaginationFactory();
      spyOn(searchApiServiceMock, 'loadMore').and.returnValue(of(searchResponse));

      service.loadMore().subscribe();

      expect(searchApiServiceMock.loadMore).toHaveBeenCalledWith();
      expect(searchApiServiceMock.loadMore).toHaveBeenCalledTimes(1);
    });


    it('should receive items and if is has more items or not', (done) => {
      const searchResponse: SearchPagination = SearchPaginationFactory();
      spyOn(searchApiServiceMock, 'loadMore').and.returnValue(of(searchResponse));

      service.loadMore().subscribe((response) => {
        expect(response).toEqual(searchResponse);
        done();
      });

      expect(searchApiServiceMock.loadMore).toHaveBeenCalledWith();
      expect(searchApiServiceMock.loadMore).toHaveBeenCalledTimes(1);
    });

    it('should ask the favourites items', (done) => {
      const searchResponse: SearchPagination = SearchPaginationFactory();
      const itemsFavourites: SearchItem[] = searchResponse.items.map((item: SearchItem, index: number) => {
        const searchItem: SearchItem = { ...item };
        if (index % 2) {
          searchItem.flags.favourited = true;
        }
        return searchItem;
      });
      spyOn(searchFavouritesServiceMock, 'getFavouritesByItems').and.returnValue(of(itemsFavourites));
      spyOn(searchApiServiceMock, 'loadMore').and.returnValue(of(searchResponse));

      service.loadMore().subscribe((response) => {
        expect(response).toEqual({hasMore: searchResponse.hasMore, items: itemsFavourites});
        done();
      });

      expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledTimes(1);
      expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledWith(searchResponse.items);
    });
  });
});
