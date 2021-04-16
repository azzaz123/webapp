import { TestBed } from '@angular/core/testing';
import { SearchItemListFactory } from '@fixtures/item-card.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
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
    const searchItemList: ItemCard[] = SearchItemListFactory(20);
    const searchItemIdsList: string[] = searchItemList.map(({id}: ItemCard) => id);
    const itemIdsFavourites: string[] = searchItemList.slice(0, 5).map(({id}: ItemCard) => id);

    it('should call favorite items id of favourite api service', () => {
      spyOn(favouritesApiServiceMock, 'getFavouriteItemsId').and.callThrough();

      service.getFavouritesByItems(searchItemList).subscribe();

      expect(favouritesApiServiceMock.getFavouriteItemsId).toHaveBeenCalledWith(searchItemIdsList);
      expect(favouritesApiServiceMock.getFavouriteItemsId).toHaveBeenCalledTimes(1);
    });

    it('should receive items favourites', (done) => {
      const searchItemFavourites: ItemCard[] = searchItemList.map((searchItem: ItemCard) => {
        const newSearchItem: ItemCard = {...searchItem};
        if (itemIdsFavourites.includes(newSearchItem.id)) {
          newSearchItem.flags.favorite = true;
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
