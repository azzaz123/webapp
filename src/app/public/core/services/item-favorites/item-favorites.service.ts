import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FavoritesApiService } from '../api/favorites/favorites-api.service';
import { CheckSessionService } from '../check-session/check-session.service';

@Injectable()
export class ItemFavoritesService {
  constructor(private checkSessionService: CheckSessionService, private favoritesApiService: FavoritesApiService) {}

  public getFavouritedItemIds(itemsId: string[]): Observable<string[]> {
    // TODO: check if not our own user		Date: 2021/04/08
    if (this.checkSessionService.hasSession()) {
      return this.favoritesApiService.getFavoriteItemsId(itemsId);
    }
    return of([]);
  }
}
