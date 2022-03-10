import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { cloneDeep } from 'lodash-es';

import {
  ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED,
  ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE,
  MOCK_BUMPS_PACKAGE_BALANCE,
  MOCK_BUMPS_PACKAGE_BALANCE_MAPPED,
} from '@fixtures/bump-package.fixtures.spec';
import {
  MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED,
  MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED,
} from '@fixtures/subscriptions.fixtures.spec';
import { mapBalance, mapItemsWithProducts, mapItemWithProductsAndSubscriptionBumps } from './bumps-mapper';

describe('Bump mapper', () => {
  describe('when mapping balance of bumps package', () => {
    it('should map to balance of bumps package domain', () => {
      const mappedBalance = mapBalance(MOCK_BUMPS_PACKAGE_BALANCE);
      expect(mappedBalance).toEqual(MOCK_BUMPS_PACKAGE_BALANCE_MAPPED);
    });
  });
});

describe('Items with products mapper', () => {
  describe('when mapping items with products', () => {
    describe('and has city bumps', () => {
      it('should map items with products domain', () => {
        const mappedItems = mapItemsWithProducts(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE);
        expect(mappedItems[1]).toEqual(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[1]);
      });
    });
    describe('and has not city bumps', () => {
      it('should map items with products domain', () => {
        const mappedItems = mapItemsWithProducts(ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE);
        expect(mappedItems[0]).toEqual(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0]);
      });
    });
  });
});

describe('Item with products and subscription bumps mapper', () => {
  describe('when mapping item with products and subscriptions bumps', () => {
    describe('and has not subscriptions for this item', () => {
      it('should map item with products domain', () => {
        const mappedItem = mapItemWithProductsAndSubscriptionBumps(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0], null);
        expect(mappedItem).toEqual(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0]);
      });
    });
    describe('and has a subscription active', () => {
      describe('and has products matching with free bumps', () => {
        it('should map free bumps into products', () => {
          const mappedItem = mapItemWithProductsAndSubscriptionBumps(
            cloneDeep(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0]),
            cloneDeep(MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED[0])
          );

          expect(mappedItem.products[0].durations[0].isFreeOption).toEqual(true);
          expect(mappedItem.products[0].durations[0].subscriptionPackageType).toEqual(SUBSCRIPTION_CATEGORY_TYPES.CARS);
        });
      });
      describe('and has not products matching with free bumps', () => {
        it('should create free bumps products', () => {
          const mappedItem = mapItemWithProductsAndSubscriptionBumps(
            cloneDeep(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[1]),
            cloneDeep(MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED[0])
          );

          expect(mappedItem.products[0].durations[3].isFreeOption).toEqual(true);
          expect(mappedItem.products[0].durations[3].subscriptionPackageType).toEqual(SUBSCRIPTION_CATEGORY_TYPES.CARS);
        });
      });
    });
    describe('and has not any subscription active', () => {
      it('should map item with products domain', () => {
        const mappedItem = mapItemWithProductsAndSubscriptionBumps(
          cloneDeep(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0]),
          cloneDeep(MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED[1])
        );
        expect(mappedItem.products[0].durations[0].isFreeOption).toEqual(undefined);
        expect(mappedItem.products[0].durations[0].subscriptionPackageType).toEqual(undefined);
      });
    });
    describe('and has not subscription bump package', () => {
      it('should map item with products domain', () => {
        const mappedItem = mapItemWithProductsAndSubscriptionBumps(
          cloneDeep(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0]),
          cloneDeep(MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED[2])
        );
        expect(mappedItem.products[0].durations[0].isFreeOption).toEqual(undefined);
        expect(mappedItem.products[0].durations[0].subscriptionPackageType).toEqual(undefined);
      });
    });
  });
});
