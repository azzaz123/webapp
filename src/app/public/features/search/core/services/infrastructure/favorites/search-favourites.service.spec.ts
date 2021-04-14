import { TestBed } from '@angular/core/testing';
import { SearchItemListFactory } from '@fixtures/search-items.fixtures';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { of } from 'rxjs';
import { SearchFavouritesService } from './search-favourites.service';


describe('SearchFavouritesService', () => {
  let service: SearchFavouritesService;
  let favouritesApiServiceMock;

  beforeEach(() => {

    favouritesApiServiceMock = {
      getFavouriteItemsId: (ids: string[]) => of(ids)
    };

    TestBed.configureTestingModule({
      providers: [
        SearchFavouritesService,
        {
          provide: FavouritesApiService,
          useValue: favouritesApiServiceMock
        }
      ],
    });

    service = TestBed.inject(SearchFavouritesService);

  });

  describe('when we want to get favourits items', () => {
    const searchItemList: SearchItem[] = SearchItemListFactory(20);
    const searchItemIdsList: string[] = searchItemList.map(({id}: SearchItem) => id);
    const itemIdsFavourites: string[] = searchItemList.slice(0, 5).map(({id}: SearchItem) => id);

    it('should call favorite items id of favourite api service', () => {
      spyOn(favouritesApiServiceMock, 'getFavouriteItemsId').and.callThrough();

      service.getFavouritesByItems(searchItemList).subscribe();

      expect(favouritesApiServiceMock.getFavouriteItemsId).toHaveBeenCalledWith(searchItemIdsList);
      expect(favouritesApiServiceMock.getFavouriteItemsId).toHaveBeenCalledTimes(1);
    });

    it('should receive items favourites', (done) => {
      const searchItemFavourites: SearchItem[] = searchItemList.map((searchItem: SearchItem) => {
        const newSearchItem: SearchItem = {...searchItem};
        if (itemIdsFavourites.includes(newSearchItem.id)) {
          newSearchItem.flags.favourited = true;
        }
        return newSearchItem;
      });
      spyOn(favouritesApiServiceMock, 'getFavouriteItemsId').and.returnValue(of(itemIdsFavourites));

      service.getFavouritesByItems(searchItemList).subscribe((response) => {
        expect(response).toEqual(searchItemFavourites);
        done();
      });

    });
  });
});
