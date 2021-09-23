import { Item } from '@core/item/item';
import { reverse, filter, sortBy } from 'lodash-es';
import { ItemBySubscriptionResponse } from '../dtos/slots/items-subscription-type.interface';

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

export function mapSort(sortByParam: string, res: Item[]): Item[] {
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
    response.main_image,
    null,
    response.web_slug,
    response.publish_date,
    null,
    null,
    null,
    response.car_info
  );

  if (response.active_item_purchase) {
    if (response.active_item_purchase.listing_fee) {
      item.listingFeeExpiringDate = new Date().getTime() + response.active_item_purchase.listing_fee.remaining_time_ms;
    }

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
