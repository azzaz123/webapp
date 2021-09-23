import { ItemBySubscriptionResponse } from '@api/catalog-manager/dtos/slots/items-subscription-type.interface';
import { Item } from '@core/item/item';
import { Image } from '@core/user/user-response.interface';

const MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE: ItemBySubscriptionResponse = {
  id: 'xpzpv0vyd5z3',
  title: 'Jarro de agua',
  main_image: {
    id: 'nz0m0qg2n7jo',
    original_width: 800,
    original_height: 800,
    average_hex_color: 'f5f4f3',
    urls_by_size: {
      small: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W320',
      xmall: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W320',
      original: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W1024',
      large: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W800',
      xlarge: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W1024',
      medium: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W640',
    },
  },
  sale_price: 15,
  currency_code: 'EUR',
  active_item_purchase: null,
  flags: { pending: false, sold: false, reserved: true, banned: false, expired: false, onhold: false },
  visibility_flags: { bumped: false, highlighted: false, urgent: false, country_bumped: false, boosted: false },
  web_slug: 'jarro-de-agua-189762802',
  modified_date: 1632386322000,
  publish_date: 1622461053000,
};

const MOCK_IMAGE_MAPPED: Image = {
  id: 'nz0m0qg2n7jo',
  original_width: 800,
  original_height: 800,
  average_hex_color: 'f5f4f3',
  urls_by_size: {
    small: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W320',
    original: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W1024',
    large: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W800',
    xlarge: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W1024',
    medium: 'http://cdn-beta.wallapop.com/images/10420/34/z9/__/c10420p189762802/i420712103.jpg?pictureSize=W640',
  },
};

const MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED: Item = new Item(
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.id,
  null,
  null,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.title,
  null,
  null,
  null,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.sale_price,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.currency_code,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.modified_date,
  null,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.flags,
  null,
  null,
  MOCK_IMAGE_MAPPED,
  null,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.web_slug,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.publish_date,
  null,
  null,
  null,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE.car_info
);

const MOCK_ITEM_2_BY_SUBSCRIPTION_TYPE_RESPONSE: ItemBySubscriptionResponse = {
  id: '9nz07ekpvdjo',
  title: 'bicicleta Barna',
  main_image: {
    id: 'nz0m0eqy2rjo',
    original_width: 159,
    original_height: 159,
    average_hex_color: 'd0cfd4',
    urls_by_size: {
      small: 'http://cdn-beta.wallapop.com/images/10420/34/xz/__/c10420p189702803/i420642103.jpg?pictureSize=W320',
      xmall: 'http://cdn-beta.wallapop.com/images/10420/34/xz/__/c10420p189702803/i420642103.jpg?pictureSize=W320',
      original: 'http://cdn-beta.wallapop.com/images/10420/34/xz/__/c10420p189702803/i420642103.jpg?pictureSize=W1024',
      large: 'http://cdn-beta.wallapop.com/images/10420/34/xz/__/c10420p189702803/i420642103.jpg?pictureSize=W800',
      xlarge: 'http://cdn-beta.wallapop.com/images/10420/34/xz/__/c10420p189702803/i420642103.jpg?pictureSize=W1024',
      medium: 'http://cdn-beta.wallapop.com/images/10420/34/xz/__/c10420p189702803/i420642103.jpg?pictureSize=W640',
    },
  },
  sale_price: 20000,
  currency_code: 'EUR',
  active_item_purchase: { bump: { type: 'citybump', remaining_time_ms: 517640000 } },
  flags: { pending: false, sold: false, reserved: false, banned: false, expired: false, onhold: false },
  visibility_flags: { bumped: true, highlighted: false, urgent: false, country_bumped: false, boosted: false },
  web_slug: 'bicicleta-189702803',
  modified_date: 1632305601000,
  publish_date: 1622028181000,
};

export const MOCK_ITEMS_BY_SUBSCRIPTION_TYPE_RESPONSE: ItemBySubscriptionResponse[] = [MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE];

export const MOCK_ITEMS_BY_SUBSCRIPTION_TYPE_MAPPED: Item[] = [MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED];
