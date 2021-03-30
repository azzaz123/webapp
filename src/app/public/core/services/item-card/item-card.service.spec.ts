import { TestBed } from '@angular/core/testing';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { ItemCardService } from './item-card.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';

describe('ItemCardService', () => {
  let itemCardService: ItemCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemCardService, ItemApiService],
      imports: [HttpClientTestingModule],
    });

    itemCardService = TestBed.inject(ItemCardService);
  });

  describe('toogleFavourite', () => {
    it('should set favourite flag if not favourite', () => {
      const ITEM = MOCK_ITEM_CARD;
      ITEM.flags.favorite = false;

      itemCardService.toggleFavourite(ITEM);

      expect(ITEM.flags.favorite).toBeTruthy();
    });

    it('should remove favourite flag if already favourite', () => {
      const ITEM = MOCK_ITEM_CARD;
      ITEM.flags.favorite = true;

      itemCardService.toggleFavourite(ITEM);

      expect(ITEM.flags.favorite).toBeFalsy();
    });
  });
});
