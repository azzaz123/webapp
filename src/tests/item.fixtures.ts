import { ItemResponse } from '../app/core/item/item-response.interface';

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
  'id': '0j2ylvwlnmzy',
  'type': 'consumer_goods',
  'content': {
    'id': '0j2ylvwlnmzy',
    'title': 'The title',
    'description': 'The description',
    'image': {
      'original': 'http://localhost:8080/shnm-portlet/images?pictureId=500008511&pictureSize=W320',
      'small': 'http://localhost:8080/shnm-portlet/images?pictureId=500008511&pictureSize=W320',
      'large': 'http://localhost:8080/shnm-portlet/images?pictureId=500008511&pictureSize=W320',
      'medium': 'http://localhost:8080/shnm-portlet/images?pictureId=500008511&pictureSize=W320',
      'xlarge': 'http://localhost:8080/shnm-portlet/images?pictureId=500008511&pictureSize=W320',
      'original_width': 100,
      'original_height': 62
    },
    'user': {
      'id': 'l1kmzn82zn3p',
      'micro_name': 'USER T.',
      'image': {
        'original': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W800',
        'small': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W320',
        'large': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W800',
        'medium': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W640',
        'xlarge': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W800',
        'original_width': 200,
        'original_height': 200
      },
      'online': false,
      'kind': 'professional'
    },
    'flags': {'pending': false, 'sold': false, 'reserved': false, 'banned': false, 'expired': false},
    'visibility_flags': {'bumped': false, 'highlighted': false, 'urgent': false},
    'price': 123.45,
    'currency': 'EUR'
  }
}, {
  'id': 'd1mxzo5269yq',
  'type': 'cars',
  'content': {
    'id': 'd1mxzo5269yq',
    'title': 'SEAT Ibiza 4 seats',
    'description': 'Como nuevo',
    'image': {
      'original': 'http://localhost:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
      'small': 'http://localhost:8080/shnm-portlet/images?pictureId=168&pictureSize=W320',
      'large': 'http://localhost:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
      'medium': 'http://localhost:8080/shnm-portlet/images?pictureId=168&pictureSize=W640',
      'xlarge': 'http://localhost:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
      'original_width': 200,
      'original_height': 200
    },
    'user': {
      'id': 'l1kmzn82zn3p',
      'micro_name': 'USER T.',
      'image': {
        'original': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W800',
        'small': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W320',
        'large': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W800',
        'medium': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W640',
        'xlarge': 'http://localhost:8080/shnm-portlet/images?pictureId=101&pictureSize=W800',
        'original_width': 200,
        'original_height': 200
      },
      'online': false,
      'kind': 'professional'
    },
    'flags': {'pending': false, 'sold': false, 'reserved': false, 'banned': false, 'expired': false},
    'visibility_flags': {'bumped': true, 'highlighted': false, 'urgent': false},
    'price': 10000.0,
    'currency': 'EUR'
  }
}];
