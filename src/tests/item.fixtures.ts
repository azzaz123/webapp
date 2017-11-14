import { ConversationUser, ItemResponse } from '../app/core/item/item-response.interface';

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
  'id': 'xzo81pl11l69',
  'type': 'cars',
  'content': {
    'id': 'xzo81pl11l69',
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
  'id': 'qzm4w59wwgzv',
  'type': 'cars',
  'content': {
    'id': 'qzm4w59wwgzv',
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
    'user': {'id': 'g0j232rpgd6y',
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

