import { TestBed } from '@angular/core/testing';
import { locationCategoryFilterParametersMock, locationFilterParametersMock } from '@fixtures/filter-parameter.fixtures';
import { MOCK_ITEM_CARD, ItemCardListFactory, SearchPaginationFactory } from '@fixtures/item-card.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SearchPagination } from '@public/features/search/interfaces/search-pagination.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { of } from 'rxjs';
import { MOCK_SEARCH_ID } from '../search-list-tracking-events/search-list-tracking-events.fixtures.spec';
import { SearchAPIService } from './api/search-api.service';
import { SearchFavouritesService } from './favorites/search-favourites.service';
import { SearchInfrastructureService } from './search-infrastructure.service';
import { SORT_BY } from '@api/core/model/lists/sort.enum';
import { CatalogApiService } from '@api/catalog/catalog-api.service';
import { PaginatedList } from '@api/core/model';


describe('SearchInfrastructureService', () => {
  let service: SearchInfrastructureService;
  let searchApiServiceMock;
  let searchFavouritesServiceMock;
  let catalogApiServiceMock;

  beforeEach(() => {
    searchApiServiceMock = {
      searchId: MOCK_SEARCH_ID,
      search: (params: FilterParameter[]) => of(SearchPaginationFactory()),
      loadMore: () => of(SearchPaginationFactory())
    };

    searchFavouritesServiceMock = {
      getFavouritesByItems: (itemCards: ItemCard[]) => of(itemCards)
    };

    catalogApiServiceMock = {
      getWallItems: () => of([MOCK_ITEM_CARD])
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
        },
        {
          provide: CatalogApiService,
          useValue: catalogApiServiceMock
        }
      ]
    });
    service = TestBed.inject(SearchInfrastructureService);
  });

  describe('when we search with non-wall parameters', () => {
    describe('on first load', () => {
      it('should call to search api to search', () => {
        const filters: FilterParameter[] = locationCategoryFilterParametersMock;
        const searchResponse: SearchPagination = SearchPaginationFactory();
        spyOn(searchApiServiceMock, 'search').and.returnValue(of(searchResponse));

        service.search(filters).subscribe();

        expect(searchApiServiceMock.search).toHaveBeenCalledWith(filters);
        expect(searchApiServiceMock.search).toHaveBeenCalledTimes(1);
      });

      it('should receive items and if is has more items or not', (done) => {
        const filters: FilterParameter[] = locationCategoryFilterParametersMock;
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
        const filters: FilterParameter[] = locationCategoryFilterParametersMock;
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

    describe('on load more', () => {
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

  describe('when we search only with wall parameters', () => {
    let paginatedList: PaginatedList<ItemCard>;

    beforeEach(() => {
      paginatedList = {
        paginationParameter: 'next',
        orderParameter: SORT_BY.DISTANCE,
        list: ItemCardListFactory(40)
      };
    });
    describe('on first load', () => {
      it('should call to wall api to search', () => {
        const filters: FilterParameter[] = locationFilterParametersMock;
        spyOn(catalogApiServiceMock, 'getWallItems').and.returnValue(of(paginatedList));

        service.search(filters).subscribe();

        expect(catalogApiServiceMock.getWallItems).toHaveBeenCalledWith({latitude: 0, longitude: 0}, false);
        expect(catalogApiServiceMock.getWallItems).toHaveBeenCalledTimes(1);
      });

      it('should receive items and if is has more items or not', (done) => {
        const filters: FilterParameter[] = locationFilterParametersMock;
        spyOn(catalogApiServiceMock, 'getWallItems').and.returnValue(of(paginatedList));

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({ bubble: null, hasMore: true, items: paginatedList.list, sortBy: paginatedList.orderParameter, searchId: null });
          done();
        });

        expect(catalogApiServiceMock.getWallItems).toHaveBeenCalledWith({latitude: 0, longitude: 0}, false);
        expect(catalogApiServiceMock.getWallItems).toHaveBeenCalledTimes(1);
      });

      it('should ask the favourites items', (done) => {
        const filters: FilterParameter[] = locationFilterParametersMock;
        const itemsFavourites: ItemCard[] = paginatedList.list.map((item: ItemCard, index: number) => {
          const itemCard: ItemCard = { ...item };
          if (index % 2) {
            itemCard.flags.favorite = true;
          }
          return itemCard;
        });
        spyOn(searchFavouritesServiceMock, 'getFavouritesByItems').and.returnValue(of(itemsFavourites));
        spyOn(catalogApiServiceMock, 'getWallItems').and.returnValue(of(paginatedList));

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({hasMore: !!paginatedList.paginationParameter, items: itemsFavourites, searchId: null, sortBy: paginatedList.orderParameter, bubble: null});
          done();
        });

        expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledTimes(1);
        expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledWith(paginatedList.list);
      });
    });

    describe('on load more', () => {
      beforeEach(() => {
        service.search(locationFilterParametersMock).subscribe();
      });
      it('should call to search api to load more', () => {
        const searchResponse: SearchPagination = SearchPaginationFactory();
        spyOn(catalogApiServiceMock, 'getWallItems').and.returnValue(of(searchResponse));

        service.loadMore().subscribe();

        expect(catalogApiServiceMock.getWallItems).toHaveBeenCalledWith({"latitude": 0, "longitude": 0}, false, undefined);
        expect(catalogApiServiceMock.getWallItems).toHaveBeenCalledTimes(1);
      });


      it('should receive items and if is has more items or not', (done) => {
        spyOn(catalogApiServiceMock, 'getWallItems').and.returnValue(of(paginatedList));

        service.loadMore().subscribe((response) => {
          expect(response).toEqual({hasMore: !!paginatedList.paginationParameter, items: paginatedList.list, searchId: null, sortBy: paginatedList.orderParameter, bubble: null});
          done();
        });

        expect(catalogApiServiceMock.getWallItems).toHaveBeenCalledWith({"latitude": 0, "longitude": 0}, false, undefined);
        expect(catalogApiServiceMock.getWallItems).toHaveBeenCalledTimes(1);
      });

      it('should ask the favourites items', (done) => {
        const itemsFavourites: ItemCard[] = paginatedList.list.map((item: ItemCard, index: number) => {
          const itemCard: ItemCard = { ...item };
          if (index % 2) {
            itemCard.flags.favorite = true;
          }
          return itemCard;
        });
        spyOn(searchFavouritesServiceMock, 'getFavouritesByItems').and.returnValue(of(itemsFavourites));
        spyOn(catalogApiServiceMock, 'getWallItems').and.returnValue(of(paginatedList));

        service.loadMore().subscribe((response) => {
          expect(response).toEqual({hasMore: !!paginatedList.paginationParameter, items: itemsFavourites, searchId: null, sortBy: SORT_BY.DISTANCE, bubble: null});
          done();
        });

        expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledTimes(1);
        expect(searchFavouritesServiceMock.getFavouritesByItems).toHaveBeenCalledWith(paginatedList.list);
      });
    });
  });


});

