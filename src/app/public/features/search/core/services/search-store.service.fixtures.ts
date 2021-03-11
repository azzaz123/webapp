import { SearchItem } from '../../interfaces/search-item.interface';

export const MOCK_SEARCH_ITEM: SearchItem = {
  id: 'kmzn9k7wy0jn',
  title: 'This is my title',
  description: 'I am a nice item!',
  price: 293,
  currency: 'EUR',
  images: [
    'https://cdn-beta.wallapop.com/images/10420/34/ck/__/c10420p188702861/i419448161.jpg?pictureSize=W640',
    'https://cdn-beta.wallapop.com/images/10420/34/ck/__/c10420p188702861/i419448161.jpg?pictureSize=W640',
    'https://cdn-beta.wallapop.com/images/10420/34/ck/__/c10420p188702861/i419448161.jpg?pictureSize=W640',
  ],
  flags: {
    bumped: false,
    favourited: false,
    reserved: false,
  },
};
