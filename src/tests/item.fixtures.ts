import {
  AvailableProductsResponse,
  CarUploadForm,
  ConversationUser, Duration,
  ItemResponse, ItemsWithAvailableProductsResponse,
  ItemUploadForm, ItemWithProducts,
  Order,
  Product, ProductDurations,
  Purchase
} from '../app/core/item/item-response.interface';
import { USER_LOCATION, ITEM_ID, Item } from 'shield';
import { OrderEvent } from '../app/catalog/list/selected-items/selected-product.interface';
import { CartItem } from '../app/catalog/checkout/cart/cart-item.interface';

export const PICTURE_ID = '9jd7ryx5odjk';

export const ITEM_DATA_V3: ItemResponse = {
  'id': '0j2ylvwrpmzy',
  'type': 'consumer_goods',
  'content': {
    'id': '0j2ylvwrpmzy',
    'title': 'The title',
    'description': 'The description',
    'category_id': 12545,
    'seller_id': 'l1kmzn82zn3p',
    'flags': {'pending': false, 'sold': false, 'reserved': false, 'banned': false, 'expired': false},
    'sale_price': 123.45,
    'currency_code': 'EUR',
    'modified_date': 1500545785245,
    'url': 'http://dock2.wallapop.com/i/500002511?_pid=wi&_uid=101',
    'images': [{
      'id': '0j2ylvwrpmzy',
      'original_width': 100,
      'original_height': 62,
      'average_hex_color': '6a707b',
      'urls_by_size': {
        'original': 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        'small': 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        'large': 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        'medium': 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        'xlarge': 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320'
      }
    }],
    'sale_conditions': {'fix_price': false, 'exchange_allowed': false, 'shipping_allowed': false},
    'web_slug': 'raton-134690716'
  }
};

export const ITEMS_DATA_V3 = [{
  'id': '1',
  'type': 'consumer_goods',
  'content': {
    'id': '1',
    'title': 'Toyota Yaris 1.3 99CV',
    'description': 'Marca: Toyota',
    'image': {
      'original': 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W640',
      'small': 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W320',
      'large': 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W640',
      'medium': 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W640',
      'xlarge': 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W640',
      'original_width': 688,
      'original_height': 392
    },
    'seller_id': 'l1kmzn82zn3p',
    'flags': {
      'pending': false,
      'sold': false,
      'reserved': false,
      'banned': false,
      'expired': false,
      'bumped': false,
      'highlighted': false,
      'urgent': false
    },
    'sale_price': 12900.0,
    'currency_code': 'EUR',
    'modified_date': 1505891021000,
    'publish_date': 1505891021000,
    'web_slug': 'toyota-yaris-1-3-99cv-500008657',
    'views': 0,
    'favorites': 0
  }
}, {
  'id': '2',
  'type': 'consumer_goods',
  'content': {
    'id': '2',
    'title': 'Volvo V70 XC AWD Cross Country',
    'description': 'Marca: Volvo',
    'image': {
      'original': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'small': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W320',
      'large': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'medium': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'xlarge': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'original_width': 688,
      'original_height': 392
    },
    'seller_id': 'l1kmzn82zn3p',
    'flags': {
      'pending': false,
      'sold': false,
      'reserved': false,
      'banned': false,
      'expired': false,
      'bumped': false,
      'highlighted': false,
      'urgent': false
    },
    'sale_price': 7500.0,
    'currency_code': 'EUR',
    'modified_date': 1505891020000,
    'publish_date': 1505891020000,
    'web_slug': 'volvo-v70-xc-awd-cross-country-500008656',
    'views': 0,
    'favorites': 0
  }
}, {
  'id': '3',
  'type': 'consumer_goods',
  'content': {
    'id': '3',
    'title': 'Volvo V70 XC AWD Cross Country',
    'description': 'Marca: Volvo',
    'image': {
      'original': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'small': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W320',
      'large': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'medium': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'xlarge': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'original_width': 688,
      'original_height': 392
    },
    'seller_id': 'l1kmzn82zn3p',
    'flags': {
      'pending': false,
      'sold': false,
      'reserved': false,
      'banned': false,
      'expired': false,
      'bumped': false,
      'highlighted': false,
      'urgent': false
    },
    'sale_price': 7500.0,
    'currency_code': 'EUR',
    'modified_date': 1505891020000,
    'publish_date': 1505891020000,
    'web_slug': 'volvo-v70-xc-awd-cross-country-500008656',
    'views': 0,
    'favorites': 0
  }
}, {
  'id': '4',
  'type': 'consumer_goods',
  'content': {
    'id': '4',
    'title': 'Volvo V70 XC AWD Cross Country',
    'description': 'Marca: Volvo',
    'image': {
      'original': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'small': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W320',
      'large': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'medium': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'xlarge': 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
      'original_width': 688,
      'original_height': 392
    },
    'seller_id': 'l1kmzn82zn3p',
    'flags': {
      'pending': false,
      'sold': false,
      'reserved': false,
      'banned': false,
      'expired': false,
      'bumped': false,
      'highlighted': false,
      'urgent': false
    },
    'sale_price': 7500.0,
    'currency_code': 'EUR',
    'modified_date': 1505891020000,
    'publish_date': 1505891020000,
    'web_slug': 'volvo-v70-xc-awd-cross-country-500008656',
    'views': 0,
    'favorites': 0
  }
}];

export const MOCK_ITEM_V3: Item = new Item(
  ITEMS_DATA_V3[0].content.id,
  null,
  ITEMS_DATA_V3[0].content.seller_id,
  ITEMS_DATA_V3[0].content.title,
  ITEMS_DATA_V3[0].content.description,
  undefined,
  null,
  ITEMS_DATA_V3[0].content.sale_price,
  ITEMS_DATA_V3[0].content.currency_code,
  ITEMS_DATA_V3[0].content.modified_date,
  undefined,
  ITEMS_DATA_V3[0].content.flags,
  null,
  undefined,
  {
    id: '1',
    original_width: ITEMS_DATA_V3[0].content.image.original_width,
    original_height: ITEMS_DATA_V3[0].content.image.original_height,
    average_hex_color: '',
    urls_by_size: ITEMS_DATA_V3[0].content.image
  },
  undefined,
  ITEMS_DATA_V3[0].content.web_slug,
  ITEMS_DATA_V3[0].content.modified_date,
  undefined
);

export const MOCK_ITEM_V3_2: Item = new Item(
  ITEMS_DATA_V3[1].content.id,
  null,
  ITEMS_DATA_V3[1].content.seller_id,
  ITEMS_DATA_V3[1].content.title,
  ITEMS_DATA_V3[1].content.description,
  undefined,
  null,
  ITEMS_DATA_V3[1].content.sale_price,
  ITEMS_DATA_V3[1].content.currency_code,
  ITEMS_DATA_V3[1].content.modified_date,
  undefined,
  ITEMS_DATA_V3[1].content.flags,
  null,
  undefined,
  {
    id: '2',
    original_width: ITEMS_DATA_V3[1].content.image.original_width,
    original_height: ITEMS_DATA_V3[1].content.image.original_height,
    average_hex_color: '',
    urls_by_size: ITEMS_DATA_V3[1].content.image
  },
  undefined,
  ITEMS_DATA_V3[1].content.web_slug,
  ITEMS_DATA_V3[1].content.modified_date,
  undefined
);

export const ITEMS_DATA_v3_FAVORITES = [{
  'id': 'lqzmrdgogy6v',
  'type': 'consumer_goods',
  'content': {
    'id': 'lqzmrdgogy6v',
    'title': 'Ducati diavel',
    'description': 'Hola vendo mi preciosa Ducati diavel \nCon 13.000km\nAño 2011\nExtras como',
    'image': {
      'original': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W1024',
      'xsmall': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W320',
      'small': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W320',
      'large': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W800',
      'medium': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W640',
      'xlarge': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W1024',
      'original_width': 1024,
      'original_height': 768
    },
    'user': {
      'id': '9nz0g7kgrjok',
      'micro_name': 'Sergio M.',
      'image': {
        'original': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W640',
        'xsmall': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W320',
        'small': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W320',
        'large': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W640',
        'medium': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W640',
        'xlarge': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W640',
        'original_width': 720,
        'original_height': 1280
      },
      'online': false,
      'kind': 'normal'
    },
    'flags': {
      'pending': false,
      'sold': false,
      'reserved': false,
      'banned': false,
      'expired': false
    },
    'visibility_flags': {
      'bumped': false,
      'highlighted': false,
      'urgent': false,
      'country_bumped': false
    },
    'price': 10000,
    'currency': 'EUR',
    'web_slug': 'ducati-diavel-172859908'
  }
}, {
  'id': 'xpzppyk2xkz3',
  'type': 'consumer_goods',
  'content': {
    'id': 'xpzppyk2xkz3',
    'title': 'Ducati 175 TS-SPORT',
    'description': 'Se vende ducati 175 TS-SPORT del año 1965 restaurada',
    'image': {
      'original': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W640',
      'xsmall': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W320',
      'small': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W320',
      'large': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W640',
      'medium': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W640',
      'xlarge': 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W640',
      'original_width': 447,
      'original_height': 640
    },
    'user': {
      'id': 'g0j232rpgd6y',
      'micro_name': 'Alex S.',
      'online': false,
      'kind': 'normal'
    },
    'flags': {
      'pending': false,
      'sold': false,
      'reserved': false,
      'banned': false,
      'expired': false
    },
    'visibility_flags': {
      'bumped': false,
      'highlighted': false,
      'urgent': false,
      'country_bumped': false
    },
    'price': 3399,
    'currency': 'EUR',
    'web_slug': 'ducati-175-ts-sport-159670398'
  }
}];

export const CONVERSATION_USERS: ConversationUser[] = [{
  id: '1',
  micro_name: 'Jeff',
  last_message: 'Hola'
}, {
  id: '2',
  micro_name: 'Enric',
  last_message: 'Heyyyy'
}];

export const PURCHASES: Purchase[] = [{
  'item_id': '1',
  'expiration_date': 1510221655715,
  'visibility_flags': {'bumped': false, 'highlighted': true, 'urgent': false}
}, {
  'item_id': '3',
  'expiration_date': 1509874085135,
  'visibility_flags': {'bumped': true, 'highlighted': false, 'urgent': false}
}];

export const PRODUCT_DURATION_ID = 'l1kmzngg6n3p';
export const PRODUCT_DURATION_MARKET_CODE = 4.79;

export const PRODUCT_RESPONSE: Product = {
  'id': 'd9ke65mjox1m',
  'name': 'WEB-MARKET',
  'default_duration_index': 0,
  'durations': [{
    'id': PRODUCT_DURATION_ID,
    'duration': 168,
    'market_code': PRODUCT_DURATION_MARKET_CODE.toString(),
    'original_market_code': '5.99'
  }]
};

export const PRODUCTS_RESPONSE: AvailableProductsResponse = {
  default_product_id: '1',
  products: [PRODUCT_RESPONSE]
};

export const PRODUCT2_RESPONSE: Product = {
  'id': 'd9ke65mjox1m',
  'name': 'WEB-MARKET',
  'default_duration_index': 0,
  'durations': [{'id': 'g24g2jhg4jh24', 'duration': 168, 'market_code': '7.29', 'original_market_code': '5.99'}]
};

export const ORDER: Order = {
  item_id: '1',
  product_id: '2'
};

export const ORDER_EVENT: OrderEvent = {
  order: [{
    item_id: ITEM_ID,
    product_id: PRODUCT_DURATION_ID
  }],
  total: PRODUCT_DURATION_MARKET_CODE
};

export const UPLOAD_FORM_ITEM_VALUES: ItemUploadForm = {
  title: 'The title',
  description: 'The description',
  category_id: '12545',
  sale_price: 123.45,
  currency_code: 'EUR',
  sale_conditions: {
    fix_price: false,
    exchange_allowed: false,
    shipping_allowed: false
  },
  images: [{'image': true}]
};

export const UPLOAD_FORM_CAR_VALUES: CarUploadForm = {
  id: '',
  title: 'The title',
  storytelling: 'The description',
  model: 'model',
  brand: 'brand',
  year: 'year',
  version: 'version',
  num_seats: 4,
  body_type: 'body_type',
  km: 1000,
  engine: 'engine',
  gearbox: 'gearbox',
  category_id: '100',
  sale_price: 123.45,
  currency_code: 'EUR',
  sale_conditions: {
    fix_price: false,
    exchange_allowed: false,
    shipping_allowed: false
  },
  images: [{'image': true}],
  location: {
    address: USER_LOCATION.title,
    latitude: USER_LOCATION.approximated_latitude,
    longitude: USER_LOCATION.approximated_longitude
  }
};

export const CITYBUMP_DURATIONS: Duration[] = [{
  'id': 'p1k3zlq6xdyo',
  'duration': 24,
  'market_code': '3.19',
  'original_market_code': '1.99'
}, {
  'id': '2n08z8oj3wrq',
  'duration': 72,
  'market_code': '5.59',
  'original_market_code': '6.99'
}, {
  'id': 'd9ke65vmjox1',
  'duration': 168,
  'market_code': '7.19',
  'original_market_code': '8.99'
}];

export const ZONEBUMP_DURATIONS: Duration[] = [{
  'id': 'qpevjrwzk8y4',
  'duration': 24,
  'market_code': '3.19',
  'original_market_code': '1.99'
}, {
  'id': 'v9owzy2j5g7x',
  'duration': 72,
  'market_code': '3.19',
  'original_market_code': '3.99'
}, {
  'id': 'l1kmzngg6n3p',
  'duration': 168,
  'market_code': '4.79',
  'original_market_code': '5.99'
}];

export const COUNTRYBUMP_DURATIONS: Duration[] = [{
  'id': '5nv4z4ylzy73',
  'duration': 24,
  'market_code': '7.99',
  'original_market_code': '9.99'
}, {
  'id': '2y436edkjdgp',
  'duration': 72,
  'market_code': '15.19',
  'original_market_code': '18.99'
}, {
  'id': 'k87v6g05jeoy',
  'duration': 168,
  'market_code': '23.19',
  'original_market_code': '28.99'
}];

export const BUMP_PRODUCTS: ProductDurations = {
  '24': {
    'citybump': CITYBUMP_DURATIONS[0],
    'zonebump': ZONEBUMP_DURATIONS[0],
    'countrybump': COUNTRYBUMP_DURATIONS[0]
  },
  '72': {
    'citybump': CITYBUMP_DURATIONS[1],
    'zonebump': ZONEBUMP_DURATIONS[1],
    'countrybump': COUNTRYBUMP_DURATIONS[1]
  },
  '168': {
    'citybump': CITYBUMP_DURATIONS[2],
    'zonebump': ZONEBUMP_DURATIONS[2],
    'countrybump': COUNTRYBUMP_DURATIONS[2]
  }
};

export const ITEMS_WITH_PRODUCTS: ItemWithProducts[] = [
  {
    'item': MOCK_ITEM_V3,
    'products': BUMP_PRODUCTS
  },
  {
    'item': MOCK_ITEM_V3_2,
    'products': BUMP_PRODUCTS
  }
];

export const PRODUCT_LIST: Product[] = [{
  'id': 'qvxpzp9630nd',
  'name': 'citybump',
  'default_duration_index': 1,
  'durations': CITYBUMP_DURATIONS
}, {
  'id': 'l1kmzng6n3p8',
  'name': 'zonebump',
  'default_duration_index': 1,
  'durations': ZONEBUMP_DURATIONS
}, {
  'id': 'gvdqjw4zon09',
  'name': 'countrybump',
  'default_duration_index': 1,
  'durations': COUNTRYBUMP_DURATIONS
}];

export const ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE: ItemsWithAvailableProductsResponse[] = [{
  'id': '1',
  'type': 'consumer_goods',
  'content': ITEMS_DATA_V3[0].content,
  'productList': PRODUCT_LIST
}, {
  'id': '2',
  'type': 'consumer_goods',
  'content': ITEMS_DATA_V3[1].content,
  'productList': PRODUCT_LIST
}];

export const CART_ITEM_CITYBUMP: CartItem = {
  item: new Item('1', 1, ITEMS_DATA_V3[1].content.seller_id),
  duration: CITYBUMP_DURATIONS[0]
};

export const CART_ITEM_CITYBUMP2: CartItem = {
  item: new Item('2', 2, ITEMS_DATA_V3[1].content.seller_id),
  duration: CITYBUMP_DURATIONS[1]
};

export const CART_ITEM_ZONEBUMP: CartItem = {
  item: new Item('3', 3, ITEMS_DATA_V3[1].content.seller_id),
  duration: ZONEBUMP_DURATIONS[0]
};

export const CART_ITEM_COUNTRYBUMP: CartItem = {
  item: new Item('4', 4, ITEMS_DATA_V3[1].content.seller_id),
  duration: COUNTRYBUMP_DURATIONS[0]
};

export const CART_ITEM_COUNTRYBUMP2: CartItem = {
  item: new Item('5', 5, ITEMS_DATA_V3[1].content.seller_id),
  duration: COUNTRYBUMP_DURATIONS[1]
};
