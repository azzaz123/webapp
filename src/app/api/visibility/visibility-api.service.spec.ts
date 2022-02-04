import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { ItemWithProducts } from '@api/core/model/bumps/item-products.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { UuidService } from '@core/uuid/uuid.service';
import {
  ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED,
  ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE,
  MOCK_BUMPS_PACKAGE_BALANCE,
  MOCK_BUMPS_PACKAGE_BALANCE_MAPPED,
} from '@fixtures/bump-package.fixtures.spec';
import { MOCK_ITEM_V3, PRODUCT_RESPONSE } from '@fixtures/item.fixtures.spec';
import { MockSubscriptionService, MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED } from '@fixtures/subscriptions.fixtures.spec';
import { Cart } from '@shared/catalog/cart/cart';
import { of } from 'rxjs';
import { BumpsHttpService } from './http/bumps.service';
import { VisibilityApiService } from './visibility-api.service';

describe('VisibilityApiService', () => {
  let service: VisibilityApiService;
  let httpService: BumpsHttpService;
  let subscriptionService: SubscriptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BumpsHttpService,
        VisibilityApiService,
        { provide: SubscriptionsService, useClass: MockSubscriptionService },
        UuidService,
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VisibilityApiService);
    httpService = TestBed.inject(BumpsHttpService);
    subscriptionService = TestBed.inject(SubscriptionsService);
  });

  describe('when asked to retrieve bumps package balance', () => {
    it('should return domain bumps package balance formatted', () => {
      spyOn(httpService, 'getBalance').and.returnValue(of(MOCK_BUMPS_PACKAGE_BALANCE));
      let response: BumpsPackageBalance[];
      const userId = '123';

      service.getBalance(userId).subscribe((data: BumpsPackageBalance[]) => {
        response = data;
      });

      expect(httpService.getBalance).toHaveBeenCalledTimes(1);
      expect(response).toEqual(MOCK_BUMPS_PACKAGE_BALANCE_MAPPED);
    });
  });

  describe('when use bumps from subscription package', () => {
    it('should return response', () => {
      spyOn(httpService, 'useBumpPackage').and.returnValue(of({}));
      const cart = new Cart();

      cart.add(
        {
          item: MOCK_ITEM_V3,
          duration: PRODUCT_RESPONSE.durations[0],
          isFree: true,
        },
        'zonebump'
      );

      service.bumpWithPackage(cart).subscribe(() => {});

      expect(httpService.useBumpPackage).toHaveBeenCalledTimes(1);
    });
  });

  describe('when ask for items with products and bumps package', () => {
    it('should return mapped response', () => {
      let expectedResponse: ItemWithProducts[];
      spyOn(httpService, 'getItemsWithAvailableProducts').and.returnValue(of(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE));
      spyOn(subscriptionService, 'getSubscriptions').and.returnValue(of(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED));

      service.getItemsWithProductsAndSubscriptionBumps(['1']).subscribe((response) => {
        expectedResponse = response;
      });

      expect(httpService.getItemsWithAvailableProducts).toHaveBeenCalledTimes(1);
      expect(httpService.getItemsWithAvailableProducts).toHaveBeenCalledWith(['1']);
      expect(subscriptionService.getSubscriptions).toHaveBeenCalledTimes(1);
      expect(subscriptionService.getSubscriptions).toHaveBeenCalledWith();
      expect(expectedResponse).toEqual(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED);
    });
  });
});
