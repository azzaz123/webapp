import { Item } from '@core/item/item';
import { Image } from '@core/user/user-response.interface';
import { reverse, filter, sortBy } from 'lodash-es';
import { SORT_KEYS } from '../constants/sort.constants';
import { ImageItemBySubscription, ItemBySubscriptionResponse } from '../dtos/items-by-subscription/items-subscription-type.interface';

export function mapItems(items: ItemBySubscriptionResponse[]): Item[] {
  return items.length ? items.map((i) => mapItemByCategory(i)) : [];
}

export function mapFilter(term: string, res: Item[]): Item[] {
  term = term ? term.trim().toLowerCase() : '';
  if (term !== '') {
    return filter(res, (item: Item) => {
      return item.title.toLowerCase().indexOf(term) !== -1;
    });
  }
  return res;
}

export function mapSort(sortByParam: SORT_KEYS, res: Item[]): Item[] {
  const sort = sortByParam.split('_');
  const field: string = sort[0] === 'price' ? 'salePrice' : 'modifiedDate';
  const sorted: Item[] = sortBy(res, [field]);
  if (sort[1] === 'desc') {
    return reverse(sorted);
  }
  return sorted;
}

function mapItemByCategory(response: ItemBySubscriptionResponse) {
  const item = new Item(
    response.id,
    null,
    null,
    response.title,
    null,
    null,
    null,
    response.sale_price,
    response.currency_code,
    response.modified_date,
    null,
    response.flags,
    null,
    null,
    mapImage(response.main_image),
    null,
    response.web_slug,
    response.publish_date,
    null,
    null,
    null,
    response.car_info
  );

  if (response.active_item_purchase) {
    if (response.active_item_purchase.bump) {
      item.purchases = {
        bump_type: response.active_item_purchase.bump.type,
        expiration_date: response.active_item_purchase.bump.remaining_time_ms,
      };

      item.bumpExpiringDate = new Date().getTime() + response.active_item_purchase.bump.remaining_time_ms;
    }
  }

  return item;
}

function mapImage(image: ImageItemBySubscription): Image {
  delete image.urls_by_size.xmall;

  const imageMapped: Image = {
    ...image,
    urls_by_size: {
      ...image.urls_by_size,
    },
  };

  return imageMapped;
}
