import { mapImageDtosToImages } from '@api/core/mappers';
import { BumpPackageBalance, BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { ItemWithProducts } from '@api/core/model/bumps/item-products.interface';
import { Item } from '@core/item/item';
import { ItemImagesURLs, ItemsWithAvailableProductsResponse } from '@core/item/item-response.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { BUMP_TYPES, CartBase } from '@shared/catalog/cart/cart-base';
import { CartItem } from '@shared/catalog/cart/cart-item.interface';
import { BumpsPackageBalanceDTO } from '../dtos/bumps/bumps-package-balance.interface';
import { BumpsPackageUseDTO } from '../dtos/bumps/bumps-package-use.interface';

export function mapBalance(bumps: BumpsPackageBalanceDTO[]): BumpsPackageBalance[] {
  return bumps.map(mapBump);
}

function mapBump(bump: BumpsPackageBalanceDTO): BumpsPackageBalance {
  const bumpMapped: BumpsPackageBalance = {
    ...bump,
    subscription_type: bump.subscription_type as SUBSCRIPTION_CATEGORY_TYPES,
    balance: bump.balance as BumpPackageBalance[],
  };

  return bumpMapped;
}

export function mapFreeBumpsPurchase(cart: CartBase, uuidService: UuidService): BumpsPackageUseDTO[] {
  const ordersArray: BumpsPackageUseDTO[] = [];
  BUMP_TYPES.forEach((type: string) => {
    cart[type].cartItems.map((cartItem: CartItem) => {
      if (cartItem.isFree) {
        let orderParsed = {
          id: uuidService.getUUID(),
          type,
          item_id: cartItem.item.id,
        };
        ordersArray.push(orderParsed);
      }
    });
  });
  return ordersArray;
}

export function mapItemsWithProducts(itemsWithProducts: ItemsWithAvailableProductsResponse[]): ItemWithProducts[] {
  return itemsWithProducts.map(mapItemWithProducts);
}

function mapItemWithProducts(itemWithProducts: ItemsWithAvailableProductsResponse): ItemWithProducts {
  return {
    item: mapItemsToLegacyItem(itemWithProducts),
    products: itemWithProducts.productList,
  };
}

function mapItemsToLegacyItem(itemsWithAvailable: ItemsWithAvailableProductsResponse): Item {
  const { id, title, category_id, images, price, currency, web_slug, publish_date, modified_date, image } = itemsWithAvailable.content;

  const item = new Item(
    id,
    null,
    null,
    title,
    undefined,
    category_id,
    undefined,
    price,
    currency,
    modified_date,
    web_slug,
    {
      pending: false,
      sold: false,
      favorite: false,
      reserved: false,
      banned: false,
      expired: false,
      bumped: false,
      bump_type: null,
    },
    undefined,
    undefined,
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
