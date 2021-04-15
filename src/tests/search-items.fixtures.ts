import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { SearchPagination } from '@public/features/search/interfaces/search-pagination.interface';

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

export function SearchItemListFactory(count: number = 20): SearchItem[] {
  return new Array(count).fill('').map((_, index) => ({ ...MOCK_SEARCH_ITEM, id: '235325' + index }));
}

export function SearchPaginationFactory(hasMore: boolean = false): SearchPagination {
  return {
    items: SearchItemListFactory(40),
    hasMore,
  };
}
