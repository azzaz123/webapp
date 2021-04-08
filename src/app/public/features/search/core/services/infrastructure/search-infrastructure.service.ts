import { SearchPagination } from '../../../interfaces/search-pagination.interface';

import { Injectable } from "@angular/core";
import { FilterParameter } from "@public/shared/components/filters/interfaces/filter-parameter.interface";

@Injectable()
export class SearchInfrastructureService {

  search(params: FilterParameter[]): SearchPagination {
    return null;
  }

  loadMore(): SearchPagination {

  }
}
