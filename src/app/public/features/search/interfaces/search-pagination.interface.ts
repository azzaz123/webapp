import { ItemCard } from '@public/core/interfaces/item-card.interface';

export interface SearchPagination {
  items: ItemCard[];
  hasMore: boolean;
  searchId: string;
}

export interface SearchPaginationWithCategory extends SearchPagination {
  categoryId: string;
}
