import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PUBLISHED_QUERY_PARAMS, PublishedItem, PublishedResponse, WALL_QUERY_PARAMS, WallItem, WallResponse } from '@api/catalog/dtos';
import { map, switchMap } from 'rxjs/operators';
import { Location, PaginatedList } from '@api/core/model';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { mapPublishedItemsToItemCards } from './mappers/published-item-mapper';
import { CatalogHttpService } from '@api/catalog/http/catalog-http.service';
import { QueryParams } from '@api/core/utils/types';
import { mapWallItemsToItemCards } from '@api/catalog/mappers/wall-item-mapper';
import { mapOrderParameter } from './mappers/order-parameter-mapper';

@Injectable()
export class CatalogApiService {
  constructor(private catalogHttpService: CatalogHttpService, private favouriteService: FavouritesApiService) {}

  public getUserPublishedItems(
    userId: string,
    checkFavourites: boolean,
    paginationParameter?: string
  ): Observable<PaginatedList<ItemCard>> {
    let params: QueryParams<PUBLISHED_QUERY_PARAMS>;
    if (paginationParameter) {
      params = { [PUBLISHED_QUERY_PARAMS.SINCE]: paginationParameter };
    }

    return this.catalogHttpService.getUserPublishedItems(userId, params).pipe(
      switchMap((response: PublishedResponse) => {
        let favouriteIds$ = of([]);

        if (checkFavourites) {
          const itemIds = response.data.map((item: PublishedItem) => item.id);
          favouriteIds$ = this.favouriteService.getFavouriteItemsId(itemIds);
        }

        return forkJoin(of(response), favouriteIds$).pipe(
          map(([res, favouritedIds]: [PublishedResponse, string[]]) => {
            return {
              list: mapPublishedItemsToItemCards(res.data, userId, favouritedIds),
              paginationParameter: res.meta.next,
            };
          })
        );
      })
    );
  }

  public getWallItems(location: Location, checkFavourites: boolean, paginationParameter?: string): Observable<PaginatedList<ItemCard>> {
    let params: QueryParams<WALL_QUERY_PARAMS>;
    if (paginationParameter) {
      params = { [WALL_QUERY_PARAMS.SINCE]: paginationParameter };
    }
    return this.catalogHttpService.getWallItems(location, params).pipe(
      switchMap((response: WallResponse) => {
        let favouriteIds$ = of([]);

        if (checkFavourites) {
          const itemIds = response.data.map((item: WallItem) => item.id);
          favouriteIds$ = this.favouriteService.getFavouriteItemsId(itemIds);
        }

        return forkJoin(of(response), favouriteIds$).pipe(
          map(([response, favouriteIds]: [WallResponse, string[]]) => {
            return {
              list: mapWallItemsToItemCards(response.data, favouriteIds),
              paginationParameter: response.meta.next,
              orderParameter: mapOrderParameter(response.meta.order?.type),
            };
          })
        );
      })
    );
  }
}
