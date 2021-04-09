import { Injectable } from '@angular/core';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable } from 'rxjs';
import { SearchPagination } from '../../../interfaces/search-pagination.interface';
import { SearchApiService } from './api/search-api.service';

@Injectable()
export class SearchInfrastructureService {

  constructor(private searchApiService: SearchApiService) {}

  search(params: FilterParameter[]): Observable<SearchPagination> {
    return this.searchApiService.search(params);
  }

  loadMore(): Observable<SearchPagination> {
    return this.searchApiService.loadMore();
  }
}
