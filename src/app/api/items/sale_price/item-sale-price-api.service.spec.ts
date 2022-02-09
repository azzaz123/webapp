import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_MONEY } from '@api/fixtures/core/money.fixtures';
import { of } from 'rxjs';
import { ItemSalePriceApiService } from '.';
import { ItemSalePriceHttpService } from './http/item-sale-price-http.service';

describe('ItemSalePriceApiService', () => {
  let service: ItemSalePriceApiService;
  let itemSalePriceHttpService: ItemSalePriceHttpService;

  const MOCK_ITEM_HASH: string = 'abcd';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemSalePriceApiService, ItemSalePriceHttpService],
    });
    service = TestBed.inject(ItemSalePriceApiService);
    itemSalePriceHttpService = TestBed.inject(ItemSalePriceHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to update item sale price', () => {
    beforeEach(() => {
      spyOn(itemSalePriceHttpService, 'update').and.returnValue(of(null));
    });

    it('should ask to update item sale price', () => {
      service.update(MOCK_ITEM_HASH, MOCK_MONEY).subscribe();

      expect(itemSalePriceHttpService.update).toHaveBeenCalledWith(MOCK_ITEM_HASH, MOCK_MONEY);
    });
  });
});
