import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { map, mergeMap, take } from 'rxjs/operators';
import { MeHttpService } from './http/me-http.service';
import { FavouritesResponseDto } from './dtos/favourites/response/favourites-response-dto';
import { mapFavouriteItemsToLegacyItem } from './mappers/favourite-item-mapper';
import { QueryParams } from '@api/core/utils/types';
import { FavouritesQueryParams } from '@api/me/dtos/favourites/request/favourites-query-params';
import { mapSoldItemsToLegacyItem } from './mappers/sold-item-mapper';
import { SoldItemResponseDto } from './dtos/sold/response/sold-response-dto';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';
import { ItemService } from '@core/item/item.service';
import { SoldItemsQueryParams } from './dtos/sold/request/sold-query-params';
import { mapPublishedItemsToLegacyItem } from './mappers/published-item-mapper';
import { PublishedResponseDto } from './dtos/published/response/published-response-dto';
import { PublishedQueryParams } from './dtos/published/request/published-query-params';
import { Purchase } from '@core/item/item-response.interface';

@Injectable()
export class MeApiService {
  public requestConfig: Partial<Record<STATUS, Function>> = {
    [STATUS.SOLD]: (params: string) => this.getSoldItems(params),
    [STATUS.PUBLISHED]: (params: string) => this.getPublishedItems(params),
  };

  public constructor(private httpService: MeHttpService, private itemService: ItemService) {}

  public getFavourites(paginationParameter?: string): Observable<PaginatedList<Item>> {
    let parameters: QueryParams<FavouritesQueryParams>;
    if (paginationParameter) {
      parameters = {
        since: paginationParameter,
      };
    }
    return this.httpService.getFavourites(parameters).pipe(
      take(1),
      map(({ data, meta }: FavouritesResponseDto) => ({
        list: mapFavouriteItemsToLegacyItem(data),
        paginationParameter: meta?.next,
      }))
    );
  }

  public getItems(paginationParameter: string, status: STATUS): Observable<PaginatedList<Item>> {
    if (status in this.requestConfig) {
      return this.requestConfig[status](paginationParameter);
    }
    return this.itemService.mine(paginationParameter, status).pipe(
      // TODO remove when all request were migrated
      map((response) => {
        return {
          list: response.data,
          paginationParameter: response.since,
        };
      })
    );
  }

  private getPublishedItems(paginationParameter: string): Observable<PaginatedList<Item>> {
    let parameters: QueryParams<PublishedQueryParams>;
    if (paginationParameter) {
      parameters = {
        since: paginationParameter,
      };
    }

    return this.httpService.getPublishedItems(parameters).pipe(
      map(({ data, meta }: PublishedResponseDto) => ({
        list: mapPublishedItemsToLegacyItem(data),
        paginationParameter: meta?.next,
      })),
      mergeMap((paginatedList: PaginatedList<Item>) => {
        return this.itemService.getPurchases().pipe(
          map((purchases: Purchase[]) => {
            this.itemService.mapBumpInfoToItemData(purchases, paginatedList.list);
            return paginatedList;
          })
        );
      }),
      map((paginatedList: PaginatedList<Item>) => {
        this.itemService.mapSelectedInfoToItemData(paginatedList.list);
        return paginatedList;
      })
    );
  }

  private getSoldItems(paginationParameter: string): Observable<PaginatedList<Item>> {
    let parameters: QueryParams<SoldItemsQueryParams>;
    if (paginationParameter) {
      parameters = {
        since: paginationParameter,
      };
    }
    return this.httpService.getSoldItems(parameters).pipe(
      map(({ data, meta }: SoldItemResponseDto) => ({
        list: mapSoldItemsToLegacyItem(data),
        paginationParameter: meta?.next,
      }))
    );
  }
}
