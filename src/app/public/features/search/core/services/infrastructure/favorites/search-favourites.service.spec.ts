import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SearchItemListFactory } from '@fixtures/search-items.fixtures';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { SearchFavouritesService } from './search-favourites.service';


describe('SearchFavouritesService', () => {
  let service: SearchFavouritesService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchFavouritesService],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(SearchFavouritesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  describe('when we want to get favourits items', () => {
    const searchItemList: SearchItem[] = SearchItemListFactory(20);
    const itemIdsFavourites: string[] = searchItemList.slice(0, 5).map(({id}: SearchItem) => id);



    it('should make http post to check-favourites', () => {
      service.getFavouritesByItems(searchItemList).subscribe();

      const request = httpController.expectOne('/api/v3/items/check-favourites');
      expect(request.request.method).toBe('POST');
      request.flush(itemIdsFavourites);
    });

    it('should receive items favourites', (done) => {
      const searchItemFavourites: SearchItem[] = searchItemList.map((searchItem: SearchItem) => {
        const newSearchItem: SearchItem = {...searchItem};
        if (itemIdsFavourites.includes(newSearchItem.id)) {
          newSearchItem.flags.favourited = true;
        }
        return newSearchItem;
      });

      service.getFavouritesByItems(searchItemList).subscribe((response) => {
        expect(response).toEqual(searchItemFavourites);
        done();
      });

      const request = httpController.expectOne('/api/v3/items/check-favourites');
      expect(request.request.method).toBe('POST');
      request.flush(itemIdsFavourites);
    });
  });
});
