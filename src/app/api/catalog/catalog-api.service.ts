import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PUBLISHED_QUERY_PARAMS, PublishedItem, PublishedResponse } from '@api/catalog/dtos';
import { map, switchMap } from 'rxjs/operators';
import { PaginatedList } from '../core/model/paginated-list.interface';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { mapCatalogItemsToItemCards } from './mappers/published-item-mapper';
import { CatalogHttpService } from '@api/catalog/http/catalog-http.service';
import { QueryParams } from '@api/core/utils/types';

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
              list: mapCatalogItemsToItemCards(res.data, userId, favouritedIds),
              paginationParameter: res.meta.next,
            };
          })
        );
      })
    );
  }
}
