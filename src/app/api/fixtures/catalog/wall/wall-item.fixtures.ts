import { WallItem } from '@api/catalog/dtos';

export const wallItemFixture: WallItem = {
  id: 'wall-item',
  type: 'consumer_goods',
  title: 'Wall item',
  description: 'Wall item',
  price: {
    currency: 'EUR',
    amount: 20,
  },
  distance: 30,
  images: [],
  attributes: [],
  reserved: {
    flag: false,
  },
  bump: {
    type: 'country',
  },
  pro: {
    flag: false,
  },
  slug: 'wall-item-slug',
};
