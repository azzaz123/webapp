import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { map, take } from 'rxjs/operators';
import { MeHttpService } from './http/me-http.service';
import { FavouritesResponseDto } from './dtos/favourites/response/favourites-response-dto';
import { mapFavouriteItemsToLegacyItem } from './mappers/favourite-item-mapper';
import { QueryParams } from '@api/core/utils/types';
import { FavouritesQueryParams } from '@api/me/dtos/favourites/request/favourites-query-params';
import { mapSoldItemsToLegacyItem } from './mappers/item-mapper';
import { SoldItemResponseDto } from './dtos/sold/response/sold-response-dto';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';
import { ItemService } from '@core/item/item.service';
import { SoldItemsQueryParams } from './dtos/sold/request/sold-query-params';

@Injectable()
export class MeApiService {
  public requestConfig: Partial<Record<STATUS, Function>> = {
    [STATUS.SOLD]: (params: string) => this.getSoldItems(params),
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
    return this.itemService.mine(+paginationParameter, status).pipe(
      // TODO remove when all request were migrated
      map((response) => {
        return {
          list: response.data,
          paginationParameter: response.init?.toString(),
        };
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
