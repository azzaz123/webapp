import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_MONEY } from '@api/fixtures/core/money.fixtures';
import { MOCK_ITEM_SALE_PRICE_REQUEST_DTO } from '@api/fixtures/items/sale_price/item-sale-price.fixtures.spec';
import { ITEM_SALE_PRICE_ENDPOINT } from './endpoints';
import { ItemSalePriceHttpService } from './item-sale-price-http.service';

describe('ItemSalePriceHttpService', () => {
  let service: ItemSalePriceHttpService;
  let httpMock: HttpTestingController;

  const MOCK_ITEM_HASH: string = 'abcd';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemSalePriceHttpService],
    });
    service = TestBed.inject(ItemSalePriceHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to update item sale price', () => {
    it('should ask server to update item sale price', () => {
      const expectedUrl: string = ITEM_SALE_PRICE_ENDPOINT(MOCK_ITEM_HASH);

      service.update(MOCK_ITEM_HASH, MOCK_MONEY).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(null);

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(MOCK_ITEM_SALE_PRICE_REQUEST_DTO);
    });
  });
});
