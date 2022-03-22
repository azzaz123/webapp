import { CATEGORY_IDS } from '@core/category/category-ids';
import { SearchItemRealStateResponse } from '@public/features/search/core/services/infrastructure/real_estate/search-item-real-state-response';

export const SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK: SearchItemRealStateResponse = {
  id: 'x6q943e005zy',
  title: 'CASA CON PISCINA',
  distance: 63.0,
  price: 210000,
  currency: 'EUR',
  web_slug: 'casa-con-piscina-642579190',
  operation: 'buy',
  type: 'house',
  surface: 150,
  rooms: 5,
  bathrooms: 2,
  garage: true,
  terrace: true,
  elevator: false,
  pool: true,
  garden: true,
  condition: 'mint',
  storytelling:
    'Casa esquinera de 150 m² divididos en dos pisos en parcela de 550 m² aproximados con piscina. Situada en urbanización de La Pobla de Montornès, provincia de Tarragona.',
  category_id: CATEGORY_IDS.REAL_ESTATE,
  images: [
    {
      original: 'http://cdn.wallapop.com/images/10420/am/kp/__/c10420p642579190/i2019177392.jpg?pictureSize=W1024',
      xsmall: 'http://cdn.wallapop.com/images/10420/am/kp/__/c10420p642579190/i2019177392.jpg?pictureSize=W320',
      small: 'http://cdn.wallapop.com/images/10420/am/kp/__/c10420p642579190/i2019177392.jpg?pictureSize=W320',
      large: 'http://cdn.wallapop.com/images/10420/am/kp/__/c10420p642579190/i2019177392.jpg?pictureSize=W800',
      medium: 'http://cdn.wallapop.com/images/10420/am/kp/__/c10420p642579190/i2019177392.jpg?pictureSize=W640',
      xlarge: 'http://cdn.wallapop.com/images/10420/am/kp/__/c10420p642579190/i2019177392.jpg?pictureSize=W1024',
      original_width: 640,
      original_height: 480,
    },
  ],
  user: {
    id: '0j2ywv1p4nzy',
    micro_name: 'Julia C.',
    image: {
      original: 'http://cdn.wallapop.com/images/13/6k/4e/__/c13p396595135/i2018885339.jpg?pictureSize=W1024',
      xsmall: 'http://cdn.wallapop.com/images/13/6k/4e/__/c13p396595135/i2018885339.jpg?pictureSize=W320',
      small: 'http://cdn.wallapop.com/images/13/6k/4e/__/c13p396595135/i2018885339.jpg?pictureSize=W320',
      large: 'http://cdn.wallapop.com/images/13/6k/4e/__/c13p396595135/i2018885339.jpg?pictureSize=W800',
      medium: 'http://cdn.wallapop.com/images/13/6k/4e/__/c13p396595135/i2018885339.jpg?pictureSize=W640',
      xlarge: 'http://cdn.wallapop.com/images/13/6k/4e/__/c13p396595135/i2018885339.jpg?pictureSize=W1024',
      original_width: 4032,
      original_height: 3024,
    },
    online: false,
    kind: 'normal',
  },
  flags: {
    pending: false,
    sold: false,
    reserved: false,
    banned: false,
    expired: false,
    onhold: false,
  },
  visibility_flags: {
    bumped: true,
    highlighted: false,
    country_bumped: false,
    boosted: false,
  },
};
