import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavouritesResponseDto } from '../dtos/favourites/response/favourites-response-dto';
import { HttpClient } from '@angular/common/http';
import { ME_FAVOURITES_ENDPOINT, ME_SOLD_ITEMS_ENDPOINT, NOTIFICATIONS_API_URL_ENDPOINT } from '@api/me/http/endpoints';
import { QueryParams } from '@api/core/utils/types';
import { FavouritesQueryParams } from '@api/me/dtos/favourites/request/favourites-query-params';
import { SoldItemResponseDto } from '../dtos/sold/response/sold-response-dto';
import { SoldItemsQueryParams } from '../dtos/sold/request/sold-query-params';
import { NotificationsSettingsDto } from '../dtos/notifications-settings/response/notifcations-settings-dto';
import { NotificationsSettingsResponseDto } from '../dtos/notifications-settings/response/notifcations-settings-response-dto';

@Injectable()
export class MeHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getFavourites(params?: QueryParams<FavouritesQueryParams>): Observable<FavouritesResponseDto> {
    return this.httpClient.get<FavouritesResponseDto>(ME_FAVOURITES_ENDPOINT, { params });
  }

  public getSoldItems(params?: QueryParams<SoldItemsQueryParams>): Observable<SoldItemResponseDto> {
    return this.httpClient.get<SoldItemResponseDto>(ME_SOLD_ITEMS_ENDPOINT, { params });
  }

  public getMyNotificationsSettings(): Observable<NotificationsSettingsResponseDto> {
    return this.httpClient.get<NotificationsSettingsResponseDto>(NOTIFICATIONS_API_URL_ENDPOINT);
  }
}
