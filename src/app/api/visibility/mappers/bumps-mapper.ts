import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { BumpPackageBalance, BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { ItemWithProducts, SelectedProduct } from '@api/core/model/bumps/item-products.interface';
import { Item } from '@core/item/item';
import { ItemsWithAvailableProductsResponse } from '@core/item/item-response.interface';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { UuidService } from '@core/uuid/uuid.service';
import { BumpsPackageBalanceDTO, BumpsPackageBalanceResponse } from '../dtos/bumps/bumps-package-balance.interface';
import { BumpPackageUseDTO, BumpsPackageUseDTO } from '../dtos/bumps/bumps-package-use.interface';

export function mapBalance(bumps: BumpsPackageBalanceResponse): BumpsPackageBalance[] {
  return bumps.user_balance.map(mapBump);
}

function mapBump(bump: BumpsPackageBalanceDTO): BumpsPackageBalance {
  const bumpMapped: BumpsPackageBalance = {
    ...bump,
    subscription_type: bump.subscription_type as SUBSCRIPTION_CATEGORY_TYPES,
    balance: bump.balance as BumpPackageBalance[],
  };

  return bumpMapped;
}

export function mapFreeBumpsPurchase(cart: SelectedProduct[], uuidService: UuidService): BumpsPackageUseDTO {
  return {
    bumps: cart.map((cartItem) => {
      let orderParsed: BumpPackageUseDTO = {
        id: uuidService.getUUID(),
        type: cartItem.productType,
        item_id: cartItem.item.id,
        duration_days: cartItem.duration.duration / 24,
      };
      return orderParsed;
    }),
  };
}

export function mapItemsWithProducts(itemsWithProducts: ItemsWithAvailableProductsResponse[]): ItemWithProducts[] {
  return itemsWithProducts.map(mapItemWithProducts);
}

function mapItemWithProducts(itemWithProducts: ItemsWithAvailableProductsResponse): ItemWithProducts {
  return {
    item: mapItemsToLegacyItem(itemWithProducts),
    products: itemWithProducts.productList,
    isProvincialBump: !itemWithProducts.productList.find((product) => product.name === BUMP_TYPE.CITY_BUMP),
    subscription: null,
    balance: [],
  };
}

export function mapItemsWithProductsAndSubscriptionBumps(
  itemsWithProducts: ItemWithProducts[],
  subscriptions: SubscriptionsResponse[],
  subscriptionService: SubscriptionsService,
  balance: BumpsPackageBalance[]
): ItemWithProducts[] {
  return itemsWithProducts.map((item) =>
    mapItemWithProductsAndSubscriptionBumps(
      item,
      subscriptionService.getSubscriptionByCategory(subscriptions, item.item.categoryId),
      balance
    )
  );
}

export function mapItemWithProductsAndSubscriptionBumps(
  itemWithProducts: ItemWithProducts,
  subscription: SubscriptionsResponse,
  balance: BumpsPackageBalance[]
): ItemWithProducts {
  if (subscription?.selected_tier) {
    itemWithProducts.subscription = subscription;
  }
  const subscriptionBalance = balance.find((item) => item.subscription_type === subscription.type);
  if (subscriptionBalance) {
    subscriptionBalance.balance.forEach((bump) => {
      const productTypeIndex = itemWithProducts.products.findIndex((product) => product.name === bump.type);
      let durationIndex = itemWithProducts.products[productTypeIndex]?.durations.findIndex(
        (duration) => duration.duration === bump.duration_days * 24
      );
      if (durationIndex === -1) {
        itemWithProducts.products[productTypeIndex].durations.push({
          id: null,
          duration: bump.duration_days * 24,
          market_code: null,
        });
        durationIndex = itemWithProducts.products[productTypeIndex].durations.length - 1;
      }

      itemWithProducts.products[productTypeIndex].durations[durationIndex].isFreeOption = true;
      itemWithProducts.products[productTypeIndex].durations[durationIndex].subscriptionPackageType = subscription.type;
      itemWithProducts.products[productTypeIndex].durations[durationIndex].subscriptionName = subscription.category_name;
    });
    itemWithProducts.balance = subscriptionBalance.balance;
  }
  return itemWithProducts;
}

function mapItemsToLegacyItem(itemsWithAvailable: ItemsWithAvailableProductsResponse): Item {
  const {
    id,
    title,
    description,
    category_id,
    images,
    url,
    sale_price,
    currency_code,
    web_slug,
    publish_date,
    modified_date,
    image,
    flags,
    sale_conditions,
  } = itemsWithAvailable.content;

  const item = new Item(
    id,
    null,
    null,
    title,
    description,
    category_id,
    null,
    sale_price,
    currency_code,
    modified_date,
    url,
    flags,
    null,
    sale_conditions,
    images
      ? images[0]
      : {
          id,
          original_width: image ? image.original_width : null,
          original_height: image ? image.original_height : null,
          average_hex_color: '',
          urls_by_size: image,
        },
    images,
    web_slug,
    publish_date
  );
  return item;
}
