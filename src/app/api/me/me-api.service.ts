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
import { mapSoldItemsToLegacyItem } from './mappers/sold-item-mapper';
import { SoldItemResponseDto } from './dtos/sold/response/sold-response-dto';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';
import { ItemService } from '@core/item/item.service';
import { SoldItemsQueryParams } from './dtos/sold/request/sold-query-params';
import { NotificationsSettingsResponseDto } from '@api/me/dtos/notifications-settings/response/notifcations-settings-response-dto';
import { mapNotificationsSettings } from './mappers/notifications-copies-mapper';
import { NotificationSettings } from '@api/core/model/notifications';
import { I18nService } from '@core/i18n/i18n.service';

@Injectable()
export class MeApiService {
  public requestConfig: Partial<Record<STATUS, Function>> = {
    [STATUS.SOLD]: (params: string) => this.getSoldItems(params),
  };

  public constructor(private httpService: MeHttpService, private itemService: ItemService, private i18nService: I18nService) {}

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

  public getMyNotificationsSettings(): Observable<NotificationSettings[]> {
    return this.httpService.getMyNotificationsSettings().pipe(
      map(({ notificationGroups }: NotificationsSettingsResponseDto) => {
        return mapNotificationsSettings(notificationGroups, this.i18nService);
      })
    );
  }

  public setNotificationEnable(notificationId): Observable<void> {
    return this.httpService.setNotificationEnable(notificationId);
  }

  public setNotificationDisabled(notificationId): Observable<void> {
    return this.httpService.setNotificationDisabled(notificationId);
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
