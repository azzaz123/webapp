import { Injectable } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SearchPagination } from '../../../interfaces/search-pagination.interface';
import { SearchAPIService } from './api/search-api.service';
import { SearchFavouritesService } from './favorites/search-favourites.service';
import { CatalogApiService } from '@api/catalog/catalog-api.service';
import { FILTER_PARAMETERS_SEARCH } from '@public/features/search/core/services/constants/filter-parameters';
import { Location, PaginatedList } from '@api/core/model';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Injectable()
export class SearchInfrastructureService {
  constructor(private searchApiService: SearchAPIService, private searchFavouritesService: SearchFavouritesService, private catalogApiService: CatalogApiService) {}

  private wallParameters: string[] = [
    FILTER_PARAMETERS_SEARCH.LATITUDE,
    FILTER_PARAMETERS_SEARCH.LONGITUDE,
    FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE
  ];
  private wallPaginationParameter: string;
  private isWall: boolean;
  private currentLocation: Location;

  public search(params: FilterParameter[]): Observable<SearchPagination> {
    this.isWall = this.isWallQuery(params);
    this.currentLocation = this.getLocationFromParams(params);
    if (this.isWall) {
      return this.catalogApiService.getWallItems(this.currentLocation, false).pipe(
        tap((list) => this.wallPaginationParameter = list.paginationParameter),
        switchMap((list: PaginatedList<ItemCard>) => this.setFavourites(this.mapPaginatedListToSearchPagination(list)))
      );
    }

    return this.searchApiService
      .search(params)
      .pipe(switchMap((searchPagination: SearchPagination) => this.setFavourites(searchPagination)));
  }

  public loadMore(): Observable<SearchPagination> {
    if (this.isWall) {
      return this.catalogApiService.getWallItems(this.currentLocation, false, this.wallPaginationParameter).pipe(
        tap((list) => this.wallPaginationParameter = list.paginationParameter),
        switchMap((list: PaginatedList<ItemCard>) => this.setFavourites(this.mapPaginatedListToSearchPagination(list)))
      );
    }
    return this.searchApiService.loadMore().pipe(switchMap((searchPagination: SearchPagination) => this.setFavourites(searchPagination)));
  }

  private setFavourites({ items, hasMore, searchId, sortBy, bubble }: SearchPagination): Observable<SearchPagination> {
    return this.searchFavouritesService
      .getFavouritesByItems(items)
      .pipe(map((favItems: ItemCard[]) => ({ items: favItems, hasMore, searchId, sortBy, bubble })));
  }

  private isWallQuery(params: FilterParameter[]): boolean {
    return params.every(({key}: FilterParameter) => this.wallParameters.includes(key))
  }

  private getLocationFromParams(params: FilterParameter[]): Location {
    return {
      latitude: Number.parseFloat(params.find(param => param.key === FILTER_QUERY_PARAM_KEY.latitude).value),
      longitude: Number.parseFloat(params.find(param => param.key === FILTER_QUERY_PARAM_KEY.longitude).value),
    }
  }

  private mapPaginatedListToSearchPagination({ list, paginationParameter, orderParameter }: PaginatedList<ItemCard>): SearchPagination {
    return {
      items: list,
      searchId: null,
      hasMore: !!paginationParameter,
      sortBy: orderParameter,
      bubble: null
    }
  }
}
