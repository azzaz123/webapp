import { BumpPackageBalance, BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
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
