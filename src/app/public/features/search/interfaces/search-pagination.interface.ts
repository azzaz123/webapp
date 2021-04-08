import { SearchItem } from './search-item.interface';

export interface SearchPagination {
  items: SearchItem[];
  hasMore: boolean;
}
