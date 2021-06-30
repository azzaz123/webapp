import { SORT_BY } from '@public/features/search/components/sort-filter/services/constants/sort-by-options-constants';

export interface SearchResponseExtraData {
  searchId: string;
  sortBy: SORT_BY;
  bubble?: string;
}
