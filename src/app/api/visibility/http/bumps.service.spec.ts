import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { ItemsWithAvailableProductsResponse } from '@core/item/item-response.interface';
import {
  ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE,
  MOCK_BUMP_PACKAGE_RESPONSE,
  MOCK_BUMPS_PACKAGE_BALANCE,
  MOCK_ONE_ITEM_BUMP_BALANCE,
} from '@fixtures/bump-package.fixtures.spec';
import { BumpsPackageBalanceDTO, BumpsPackageBalanceResponse } from '../dtos/bumps/bumps-package-balance.interface';
import { BumpsPackageUseDTO } from '../dtos/bumps/bumps-package-use.interface';
import { BumpsHttpService } from './bumps.service';
import { BUMPS_PACKAGE_BALANCE, BUMPS_PACKAGE_USE, ITEMS_CHECK_BUMP_BALANCE, ITEMS_WITH_PRODUCTS } from './endpoints';
import { ItemsBalanceDTO } from '@api/visibility/dtos/bumps/items-balance.interface';

describe('BumpsService', () => {
  let service: BumpsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BumpsHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BumpsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('when asked to retrieve balance', () => {
    it('should retrieve bumps balance', () => {
      let response: BumpsPackageBalanceResponse;
      let userId = '123';

      service.getBalance(userId).subscribe((res) => (response = res));

      const req: TestRequest = httpMock.expectOne(BUMPS_PACKAGE_BALANCE(userId));
      req.flush(MOCK_BUMP_PACKAGE_RESPONSE);

      expect(response).toEqual(MOCK_BUMP_PACKAGE_RESPONSE);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('when asked to retrieve items balance', () => {
    it('should retrieve item balance', () => {
      let response: ItemsBalanceDTO;
      let userId = '123';
      let items = ['456'];

      service.getItemsBalance(userId, items).subscribe((res) => (response = res));

      const req: TestRequest = httpMock.expectOne(ITEMS_CHECK_BUMP_BALANCE(userId));
      req.flush(MOCK_ONE_ITEM_BUMP_BALANCE);

      expect(response).toEqual(MOCK_ONE_ITEM_BUMP_BALANCE);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('when asked to bumps items using bumps package', () => {
    it('should retrieve subscription slots', () => {
      const cart: BumpsPackageUseDTO = {
        bumps: [
          {
            id: '123456',
            item_id: '123456',
            type: BUMP_TYPE.COUNTRY_BUMP,
            duration_days: 2,
          },
        ],
      };

      service.useBumpPackage(cart).subscribe();

      const req: TestRequest = httpMock.expectOne(BUMPS_PACKAGE_USE);
      req.flush({});

      expect(req.request.method).toEqual('POST');
    });
  });

  describe('when asked get items with products', () => {
    it('should retrieve items with products', () => {
      const ids = ['1', '2', '3'];
      let response: ItemsWithAvailableProductsResponse[];

      service.getItemsWithAvailableProducts(ids).subscribe((res) => (response = res));

      const req: TestRequest = httpMock.expectOne(`${ITEMS_WITH_PRODUCTS}?itemsIds=1,2,3`);
      req.flush(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE);

      expect(response).toEqual(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE);
      expect(req.request.method).toEqual('GET');
    });
  });
});
