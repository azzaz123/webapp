import { SORT_BY } from '@api/core/model';

export interface SearchResponseExtraData {
  searchId: string;
  sortBy: SORT_BY;
  bubble?: string;
}
