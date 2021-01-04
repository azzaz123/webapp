import { TestBed } from '@angular/core/testing';
import { ItemApiService } from '@public/core/services/api/item/item-api.module';
import { ItemApiModule } from '@public/core/services/api/item/item-api.service';
import { ItemCardService } from './item-card.service';

describe('ItemCardService', () => {
  let itemApiService: ItemApiService;
  let itemCardService: ItemCardService;
  const ITEM_ID = '123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemCardService],
      imports: [ItemApiModule],
    });

    itemApiService = TestBed.inject(ItemApiService);
    itemCardService = TestBed.inject(ItemCardService);
  });

  describe('markAsFavourite', () => {
    it('should call the api service to mark the selected item as favourite', () => {
      spyOn(itemApiService, 'markAsFavourite');

      itemCardService.markAsFavourite(ITEM_ID);

      expect(itemApiService.markAsFavourite).toBeCalledWith(ITEM_ID);
    });
  });

  describe('unmarkAsFavourite', () => {
    it('should call the api service to unmark the selected item as favourite', () => {
      spyOn(itemApiService, 'unmarkAsFavourite');

      itemCardService.unmarkAsFavourite(ITEM_ID);

      expect(itemApiService.unmarkAsFavourite).toBeCalledWith(ITEM_ID);
    });
  });
});
