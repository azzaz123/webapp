import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { ItemsBySubscription, ItemWithProducts } from '@api/core/model/bumps/item-products.interface';
import { ItemService } from '@core/item/item.service';
import { StripeService } from '@core/stripe/stripe.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { UuidService } from '@core/uuid/uuid.service';
import {
  ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED_BY_SUBSCRIPTION_NO_SUB,
  ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE,
  MOCK_BUMPS_PACKAGE_BALANCE,
  MOCK_BUMPS_PACKAGE_BALANCE_MAPPED,
} from '@fixtures/bump-package.fixtures.spec';
import { ITEM_ID } from '@fixtures/item.fixtures.spec';
import { MockSubscriptionService, MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED } from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_ITEMS_TO_BUY_FREE, MOCK_ITEMS_TO_BUY_WITHOUT_FREE } from '@fixtures/visibility.fixtures.spec';
import { Cart } from '@shared/catalog/cart/cart';
import { CartChange } from '@shared/catalog/cart/cart-item.interface';
import { CartService } from '@shared/catalog/cart/cart.service';
import { of } from 'rxjs';
import { BumpsHttpService } from './http/bumps.service';
import { VisibilityApiService } from './visibility-api.service';

describe('VisibilityApiService', () => {
  let service: VisibilityApiService;
  let httpService: BumpsHttpService;
  let subscriptionService: SubscriptionsService;
  let itemService: ItemService;
  let cartService: CartService;
  let stripeService: StripeService;

  const CART = new Cart();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BumpsHttpService,
        VisibilityApiService,
        { provide: SubscriptionsService, useClass: MockSubscriptionService },
        {
          provide: CartService,
          useValue: {
            cart$: of(CART_CHANGE),
            add() {},
            createInstance() {},
            remove() {},
            clean() {},
          },
        },
        {
          provide: ItemService,
          useValue: {
            purchaseProductsWithCredits() {
              return of({
                payment_needed: true,
              });
            },
          },
        },
        {
          provide: StripeService,
          useValue: {
            buy() {},
          },
        },
        UuidService,
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VisibilityApiService);
    httpService = TestBed.inject(BumpsHttpService);
    subscriptionService = TestBed.inject(SubscriptionsService);
    cartService = TestBed.inject(CartService);
    itemService = TestBed.inject(ItemService);
    stripeService = TestBed.inject(StripeService);
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

      service.buyBumps(MOCK_ITEMS_TO_BUY_FREE, false, false, null).subscribe(() => {});

      expect(httpService.useBumpPackage).toHaveBeenCalledTimes(1);
    });
  });

  describe('when have to pay bumps', () => {
    beforeEach(() => {
      spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(
        of({
          payment_needed: false,
          items_failed: [],
        })
      );
    });

    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      service.buyBumps(MOCK_ITEMS_TO_BUY_WITHOUT_FREE, false, false, null).subscribe(() => {});

      expect(cartService.createInstance).toHaveBeenCalledWith(new Cart());
    });

    it('should call add', () => {
      spyOn(cartService, 'add').and.callThrough();

      service.buyBumps(MOCK_ITEMS_TO_BUY_WITHOUT_FREE, false, false, null).subscribe(() => {});

      MOCK_ITEMS_TO_BUY_WITHOUT_FREE.forEach((itemToBuy) => {
        expect(cartService.add).toHaveBeenCalledWith(itemToBuy, itemToBuy.productType);
      });
    });
  });

  describe('when ask for items with products and bumps package', () => {
    it('should return mapped response', () => {
      let expectedResponse: ItemsBySubscription[];
      spyOn(httpService, 'getItemsWithAvailableProducts').and.returnValue(of(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE));
      spyOn(subscriptionService, 'getSubscriptions').and.returnValue(of(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED));

      service.getItemsWithProductsAndSubscriptionBumps(['1']).subscribe((response) => {
        expectedResponse = response;
      });

      expect(httpService.getItemsWithAvailableProducts).toHaveBeenCalledTimes(1);
      expect(httpService.getItemsWithAvailableProducts).toHaveBeenCalledWith(['1']);
      expect(subscriptionService.getSubscriptions).toHaveBeenCalledTimes(1);
      expect(subscriptionService.getSubscriptions).toHaveBeenCalledWith();
      expect(expectedResponse).toEqual(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED_BY_SUBSCRIPTION_NO_SUB);
    });
  });
});
