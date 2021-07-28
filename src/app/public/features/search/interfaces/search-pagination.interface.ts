import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SORT_BY } from '@api/core/model';

export interface SearchPagination {
  items: ItemCard[];
  hasMore: boolean;
  searchId: string;
  sortBy: SORT_BY;
  bubble?: string;
}

export interface SearchPaginationWithCategory extends SearchPagination {
  categoryId: string;
}
