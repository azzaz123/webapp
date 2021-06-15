import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PUBLISHED_ITEMS_ENDPOINT } from './endpoints';
import { CatalogPublicProfileItemsResponse } from './dtos/catalog-public-profile-items-response';
import { map, switchMap } from 'rxjs/operators';
import { PaginatedList } from '../core/model/paginated-list.interface';
import { ACCEPTED_PARAMETERS } from './enums/accepted-parameters.enum';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { CatalogItem } from './dtos/catalog-item';
import { mapCatalogItemsToItemCards } from './mappers/published-item-mapper';

@Injectable()
export class CatalogApiService {
  constructor(private httpClient: HttpClient, private favouriteService: FavouritesApiService) {}

  // TODO: For now this service maps the response to ItemCard model, as it is currently the common model on the public domain. We need to
  //       port this to an "Item" model once we have a decent definition of the item domain.
  public getUserPublishedItems(
    userId: string,
    checkFavourites: boolean,
    paginationParameter?: string
  ): Observable<PaginatedList<ItemCard>> {
    let params = new HttpParams();

    if (paginationParameter) {
      params = params.append(ACCEPTED_PARAMETERS.SINCE, paginationParameter);
    }

    return this.httpClient
      .get<CatalogPublicProfileItemsResponse>(PUBLISHED_ITEMS_ENDPOINT(userId), {
        params,
      })
      .pipe(
        switchMap((response: CatalogPublicProfileItemsResponse) => {
          let favouriteIds$ = of([]);

          if (checkFavourites) {
            const itemIds = response.data.map((item: CatalogItem) => item.id);
            favouriteIds$ = this.favouriteService.getFavouriteItemsId(itemIds);
          }

          return forkJoin(of(response), favouriteIds$).pipe(
            map(([res, favouritedIds]: [CatalogPublicProfileItemsResponse, string[]]) => {
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
