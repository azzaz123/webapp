import { TestBed } from '@angular/core/testing';
import { filterParametersMock } from '@fixtures/filter-parameter.fixtures';
import { SearchPaginationFactory } from '@fixtures/item-card.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SORT_BY } from '@public/features/search/components/sort-filter/services/constants/sort-by-options-constants';
import { SearchPagination } from '@public/features/search/interfaces/search-pagination.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { of } from 'rxjs';
import { MOCK_SEARCH_ID } from '../search-list-tracking-events/search-list-tracking-events.fixtures.spec';
import { SearchAPIService } from './api/search-api.service';
import { SearchFavouritesService } from './favorites/search-favourites.service';
import { SearchInfrastructureService } from './search-infrastructure.service';


describe('SearchInfrastructureService', () => {
  let service: SearchInfrastructureService;
  let searchApiServiceMock;
  let searchFavouritesServiceMock;

  beforeEach(() => {
    searchApiServiceMock = {
      searchId: MOCK_SEARCH_ID,
      search: (params: FilterParameter[]) => of(SearchPaginationFactory()),
      loadMore: () => of(SearchPaginationFactory())
    };

    searchFavouritesServiceMock = {
      getFavouritesByItems: (itemCards: ItemCard[]) => of(itemCards)
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
      const itemsFavourites: ItemCard[] = searchResponse.items.map((item: ItemCard, index: number) => {
        const itemCard: ItemCard = { ...item };
        if (index % 2) {
          itemCard.flags.favorite = true;
        }
        return itemCard;
      });
      spyOn(searchFavouritesServiceMock, 'getFavouritesByItems').and.returnValue(of(itemsFavourites));
      spyOn(searchApiServiceMock, 'search').and.returnValue(of(searchResponse));

      service.search(filters).subscribe((response) => {
        expect(response).toEqual({hasMore: searchResponse.hasMore, items: itemsFavourites, searchId: '', sortBy: SORT_BY.DISTANCE});
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
      const itemsFavourites: ItemCard[] = searchResponse.items.map((item: ItemCard, index: number) => {
        const itemCard: ItemCard = { ...item };
        if (index % 2) {
          itemCard.flags.favorite = true;
        }
        return itemCard;
      });
      spyOn(searchFavouritesServiceMock, 'getFavouritesByItems').and.returnValue(of(itemsFavourites));
      spyOn(searchApiServiceMock, 'loadMore').and.returnValue(of(searchResponse));

      service.loadMore().subscribe((response) => {
        expect(response).toEqual({hasMore: searchResponse.hasMore, items: itemsFavourites, searchId: '', sortBy: SORT_BY.DISTANCE});
        done();
      });

      expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledTimes(1);
      expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledWith(searchResponse.items);
    });
  });
});

