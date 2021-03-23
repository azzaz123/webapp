import { Injectable } from '@angular/core';
import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';
import {
  BUMPED_ITEM_FLAG_TYPES,
  EMPTY_ITEM_FLAGS,
  EMPTY_ITEM_VISIBILITY_FLAGS,
  STATUS_FLAGS,
  STATUS_ITEM_FLAG_TYPES,
} from '@public/shared/components/item-flag/item-flag-constants';

@Injectable()
export class MapItemDetailFlagsStoreService {
  public mapStatusFlag(itemFlags: ItemFlags = EMPTY_ITEM_FLAGS): STATUS_ITEM_FLAG_TYPES {
    if (itemFlags) {
      const flagStatus = Object.keys(itemFlags).find((itemStatus: string) => {
        if (STATUS_FLAGS.some((flag) => flag.id === itemStatus) && itemFlags[itemStatus]) {
          return itemStatus;
        }
      });

      return STATUS_FLAGS.find((flag) => flag.id === flagStatus)?.itemType as STATUS_ITEM_FLAG_TYPES;
    }
  }

  public mapBumpedFlag(itemVisibilityFlags: ItemVisibilityFlags = EMPTY_ITEM_VISIBILITY_FLAGS): BUMPED_ITEM_FLAG_TYPES {
    if (itemVisibilityFlags?.country_bumped) {
      return BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP;
    }

    if (itemVisibilityFlags?.bumped) {
      return BUMPED_ITEM_FLAG_TYPES.BUMPED;
    }
  }
}
