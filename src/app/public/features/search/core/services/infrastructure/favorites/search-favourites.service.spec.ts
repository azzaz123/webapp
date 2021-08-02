import { TestBed } from '@angular/core/testing';
import { ItemCardListFactory } from '@fixtures/item-card.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ItemFavouritesService } from '@public/core/services/item-favourites/item-favourites.service';
import { of } from 'rxjs';
import { SearchFavouritesService } from './search-favourites.service';

describe('SearchFavouritesService', () => {
  let service: SearchFavouritesService;
  let itemFavouritesServiceMock;

  beforeEach(() => {

    itemFavouritesServiceMock = {
      getFavouritedItemIds: (ids: string[]) => of(ids)
    };

    TestBed.configureTestingModule({
      providers: [
        SearchFavouritesService,
        {
          provide: ItemFavouritesService,
          useValue: itemFavouritesServiceMock
        }
      ],
    });

    service = TestBed.inject(SearchFavouritesService);

  });

  describe('when we want to get favourite items', () => {
    const searchItemList: ItemCard[] = ItemCardListFactory(20);
    const searchItemIdsList: string[] = searchItemList.map(({id}: ItemCard) => id);
    const itemIdsFavourites: string[] = searchItemList.slice(0, 5).map(({id}: ItemCard) => id);

    it('should call favorite items id of favourite api service', () => {
      spyOn(itemFavouritesServiceMock, 'getFavouritedItemIds').and.callThrough();

      service.getFavouritesByItems(searchItemList).subscribe();

      expect(itemFavouritesServiceMock.getFavouritedItemIds).toHaveBeenCalledWith(searchItemIdsList);
      expect(itemFavouritesServiceMock.getFavouritedItemIds).toHaveBeenCalledTimes(1);
    });

    it('should receive items favourites', (done) => {
      const searchItemFavourites: ItemCard[] = searchItemList.map((searchItem: ItemCard) => {
        const newSearchItem: ItemCard = {...searchItem};
        if (itemIdsFavourites.includes(newSearchItem.id)) {
          newSearchItem.flags.favorite = true;
        }
        return newSearchItem;
      });
      spyOn(itemFavouritesServiceMock, 'getFavouritedItemIds').and.returnValue(of(itemIdsFavourites));

      service.getFavouritesByItems(searchItemList).subscribe((response) => {
        expect(response).toEqual(searchItemFavourites);
        done();
      });

    });
  });
});
