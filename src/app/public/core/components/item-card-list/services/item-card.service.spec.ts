import { TestBed } from '@angular/core/testing';
import { ItemApiService } from '@public/core/services/api/item/item-api.module';
import { ItemApiModule } from '@public/core/services/api/item/item-api.service';
import { ItemCardService } from './item-card-list.service';

describe('ItemCardService', () => {
  let itemApiService: ItemApiService;
  let itemCardListService: ItemCardService;
  const ITEM_ID = '123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemCardService],
      imports: [ItemApiModule],
    });

    itemApiService = TestBed.inject(ItemApiService);
    itemCardListService = TestBed.inject(ItemCardService);
  });

  describe('markAsFavourite', () => {
    it('should call the api service to mark the selected item as favorit', () => {
      spyOn(itemApiService, 'markAsFavourite');

      itemCardListService.markAsFavourite(ITEM_ID);

      expect(itemApiService.markAsFavourite).toBeCalledWith(ITEM_ID);
    });
  });

  describe('unmarkAsFavourite', () => {
    it('should call the api service to unmark the selected item as favorite', () => {
      spyOn(itemApiService, 'unmarkAsFavourite');

      itemCardListService.unmarkAsFavourite(ITEM_ID);

      expect(itemApiService.unmarkAsFavourite).toBeCalledWith(ITEM_ID);
    });
  });
});
