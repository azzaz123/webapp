import { SearchItem } from '../../interfaces/search-item.interface';

export const MOCK_SEARCH_ITEM: SearchItem = {
  id: 'search_item_id',
  title: 'This is my title',
  description: 'I am a nice item!',
  price: 293,
  currency: 'EUR',
  images: [],
  detailUrl: 'item.url.com',
  flags: {
    bumped: false,
    sold: false,
    favourited: false,
    reserved: false,
  },
};
