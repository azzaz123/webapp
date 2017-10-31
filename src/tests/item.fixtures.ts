import { ConversationUser, ItemResponse, Order, Product, Purchase } from '../app/core/item/item-response.interface';

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
  'type': 'cars',
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
  'type': 'cars',
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
  'type': 'cars',
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
  'type': 'cars',
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

export const PRODUCT_RESPONSE: Product = {
  'id': 'd9ke65mjox1m',
  'name': 'WEB-MARKET',
  'default_duration_index': 0,
  'durations': [{'id': 'l1kmzngg6n3p', 'duration': 168, 'market_code': '4.79', 'original_market_code': '5.99'}]
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
