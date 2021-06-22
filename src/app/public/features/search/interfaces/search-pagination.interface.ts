import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SORT_BY } from '../components/sort-filter/services/constants/sort-by-options-constants';

export interface SearchPagination {
  items: ItemCard[];
  hasMore: boolean;
  searchId: string;
  sortBy: SORT_BY;
}

export interface SearchPaginationWithCategory extends SearchPagination {
  categoryId: string;
}
