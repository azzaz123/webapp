import { Item } from '@core/item/item';
import { Image } from '@core/user/user-response.interface';
import { ITEM_DATA } from '@fixtures/item.fixtures.spec';

const MOCK_ITEM_IMAGES: Image[] = [
  {
    id: '4z4vl5ygwvzy',
    legacy_id: 500002514,
    original_width: 100,
    original_height: 62,
    average_hex_color: '6a707b',
    urls_by_size: {
      original: 'http://localhost:6006/images/item-camera.jpg',
      small: 'http://localhost:6006/images/item-camera.jpg',
      large: 'http://localhost:6006/images/item-camera.jpg',
      medium: 'http://localhost:6006/images/item-camera.jpg',
      xlarge: 'http://localhost:6006/images/item-camera.jpg',
    },
  },
  {
    id: '4z4vl5ygwvzy',
    legacy_id: 500002514,
    original_width: 100,
    original_height: 62,
    average_hex_color: '6a707b',
    urls_by_size: {
      original: 'http://localhost:6006/images/item-pc.jpg',
      small: 'http://localhost:6006/images/item-pc.jpg',
      large: 'http://localhost:6006/images/item-pc.jpg',
      medium: 'http://localhost:6006/images/item-pc.jpg',
      xlarge: 'http://localhost:6006/images/item-pc.jpg',
    },
  },
];

const MOCK_DESCRIPTION =
  'se vende 407 perfecto estado recién revisado correa distribución cambiada gomas nuevas es el tope gama cuero,clima,pantalla multifunción ,sensor aparcamiento ,etc .se entrega con la ITV recién pasada .abstenerse curiosos solo gente seria .cambiaría solo por moto enduro o quad precio poco negociable está en Málaga. Peugeot 407 Sedan en Málaga';

export const MOCK_ITEM: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  MOCK_DESCRIPTION,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  ITEM_DATA.flags,
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  MOCK_ITEM_IMAGES,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);
