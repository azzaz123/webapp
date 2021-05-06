import { ItemCard } from '@public/core/interfaces/item-card.interface';

export interface SearchPagination {
  items: ItemCard[];
  hasMore: boolean;
}

export interface SearchPaginationWithCategory extends SearchPagination {
  categoryId: string;
}
