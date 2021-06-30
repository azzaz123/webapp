import { Injectable } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SearchPagination } from '../../../interfaces/search-pagination.interface';
import { SearchAPIService } from './api/search-api.service';
import { SearchFavouritesService } from './favorites/search-favourites.service';

@Injectable()
export class SearchInfrastructureService {
  constructor(private searchApiService: SearchAPIService, private searchFavouritesService: SearchFavouritesService) {}

  public search(params: FilterParameter[]): Observable<SearchPagination> {
    return this.searchApiService
      .search(params)
      .pipe(switchMap((searchPagination: SearchPagination) => this.setFavourites(searchPagination)));
  }

  public loadMore(): Observable<SearchPagination> {
    return this.searchApiService.loadMore().pipe(switchMap((searchPagination: SearchPagination) => this.setFavourites(searchPagination)));
  }

  private setFavourites({ items, hasMore, searchId, sortBy }: SearchPagination): Observable<SearchPagination> {
    return this.searchFavouritesService
      .getFavouritesByItems(items)
      .pipe(map((favItems: ItemCard[]) => ({ items: favItems, hasMore, searchId, sortBy })));
  }
}
