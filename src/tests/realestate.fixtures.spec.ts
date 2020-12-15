import { USER_LOCATION } from './user.fixtures.spec';
import { RealestateContent, RealEstateUploadForm } from '../app/core/item/item-response.interface';
import { Realestate } from '../app/core/item/realestate';
import { ITEM_ID } from './item.fixtures.spec';

export const REALESTATE_CONTENT_DATA = {
  id: '9g0j2rev6ymw',
  sale_price: 10000,
  currency_code: 'EUR',
  seller_id: 'l1kmzn82zn3p',
  modified_date: 1530196347443,
  images: [
    {
      id: 'rnpj9geo6e75',
      original_width: 1088,
      original_height: 734,
      average_hex_color: '818d9e',
      urls_by_size: {
        original:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2013.jpg?pictureSize=W1024',
        xmall:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2013.jpg?pictureSize=W320',
        small:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2013.jpg?pictureSize=W320',
        large:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2013.jpg?pictureSize=W800',
        medium:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2013.jpg?pictureSize=W640',
        xlarge:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2013.jpg?pictureSize=W1024',
      },
    },
    {
      id: 'y436envq6dgp',
      original_width: 2000,
      original_height: 1500,
      average_hex_color: '7d9284',
      urls_by_size: {
        original:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2015.jpg?pictureSize=W1024',
        xmall:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2015.jpg?pictureSize=W320',
        small:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2015.jpg?pictureSize=W320',
        large:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2015.jpg?pictureSize=W800',
        medium:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2015.jpg?pictureSize=W640',
        xlarge:
          'http://cdn-dock133.wallapop.com/images/10420/01/__/c10420p2011/i2015.jpg?pictureSize=W1024',
      },
    },
  ],
  url: 'http://dock133.wallapop.com/i/2011?_pid=wi&_uid=101',
  title: 'title',
  storytelling: 'storytelling',
  flags: {
    pending: false,
    sold: false,
    reserved: false,
    banned: false,
    expired: false,
    onhold: false,
  },
  operation: 'buy',
  type: 'apartment',
  condition: 'new_construction',
  surface: 100,
  rooms: 4,
  bathrooms: 2,
  location: {
    address: 'España, Barcelona',
    approximated_location: true,
    latitude: 41.38804,
    longitude: 2.17001,
  },
  garage: true,
  terrace: false,
  elevator: false,
  pool: true,
  garden: false,
  web_slug: '32424-2011',
};

export const REALESTATE_DATA = {
  id: '9g0j2rev6ymw',
  type: 'real_estate',
  content: REALESTATE_CONTENT_DATA,
};

export const UPLOAD_FORM_REALESTATE_VALUES: RealEstateUploadForm = {
  id: ITEM_ID,
  category_id: '13000',
  title: 'title',
  sale_price: 100,
  currency_code: 'EUR',
  storytelling: 'storytelling',
  operation: 'operation',
  type: 'type',
  condition: 'condition',
  surface: 100,
  rooms: 2,
  bathrooms: 2,
  garage: false,
  terrace: false,
  elevator: false,
  pool: false,
  garden: false,
  images: [{ image: true }],
  location: {
    address: USER_LOCATION.title,
    latitude: USER_LOCATION.approximated_latitude,
    longitude: USER_LOCATION.approximated_longitude,
    approximated_location: false,
  },
};

export const MOCK_REALESTATE: Realestate = new Realestate(
  REALESTATE_CONTENT_DATA.id,
  REALESTATE_CONTENT_DATA.seller_id,
  REALESTATE_CONTENT_DATA.title,
  REALESTATE_CONTENT_DATA.storytelling,
  REALESTATE_CONTENT_DATA.location,
  REALESTATE_CONTENT_DATA.sale_price,
  REALESTATE_CONTENT_DATA.currency_code,
  REALESTATE_CONTENT_DATA.modified_date,
  REALESTATE_CONTENT_DATA.url,
  REALESTATE_CONTENT_DATA.flags,
  REALESTATE_CONTENT_DATA.images,
  REALESTATE_CONTENT_DATA.web_slug,
  REALESTATE_CONTENT_DATA.operation,
  REALESTATE_CONTENT_DATA.type,
  REALESTATE_CONTENT_DATA.condition,
  REALESTATE_CONTENT_DATA.surface,
  REALESTATE_CONTENT_DATA.bathrooms,
  REALESTATE_CONTENT_DATA.rooms,
  REALESTATE_CONTENT_DATA.garage,
  REALESTATE_CONTENT_DATA.terrace,
  REALESTATE_CONTENT_DATA.elevator,
  REALESTATE_CONTENT_DATA.pool,
  REALESTATE_CONTENT_DATA.garden
);

export const MOCK_REALESTATE_RESPONSE_CONTENT: RealestateContent = {
  id: MOCK_REALESTATE.id,
  category_id: MOCK_REALESTATE.categoryId,
  sale_price: MOCK_REALESTATE.salePrice,
  title: MOCK_REALESTATE.title,
  description: MOCK_REALESTATE.description,
  modified_date: MOCK_REALESTATE.modifiedDate,
  flags: MOCK_REALESTATE.flags,
  seller_id: 'ukd73df',
  web_slug: MOCK_REALESTATE.webSlug,
  operation: MOCK_REALESTATE.operation,
  type: MOCK_REALESTATE.type,
  surface: MOCK_REALESTATE.surface,
  rooms: MOCK_REALESTATE.rooms,
  condition: MOCK_REALESTATE.condition,
};
