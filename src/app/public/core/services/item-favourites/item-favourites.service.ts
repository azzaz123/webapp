import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FavouritesApiService } from '../api/favourites/favourites-api.service';
import { CheckSessionService } from '../check-session/check-session.service';

@Injectable({
  providedIn: 'root',
})
export class ItemFavouritesService {
  constructor(private checkSessionService: CheckSessionService, private favouritesApiService: FavouritesApiService) {}

  public getFavouritedItemIds(itemsId: string[]): Observable<string[]> {
    if (this.checkSessionService.hasSession()) {
      return this.favouritesApiService.getFavouriteItemsId(itemsId);
    }
    return of([]);
  }
}
