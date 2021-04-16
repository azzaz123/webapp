import { Injectable } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class SearchFavouritesService {

  constructor(private favouritesApiService: FavouritesApiService) {}

  getFavouritesByItems(searchItems: ItemCard[]): Observable<ItemCard[]> {
    const searchItemIds: string[] = searchItems.map(({id}) => id);
    return this.favouritesApiService.getFavouriteItemsId(searchItemIds).pipe(
      map((favouriteIds: string[]) => {
        searchItems.forEach((searchItem: ItemCard) => {
          if (favouriteIds.includes(searchItem.id)) {
            searchItem.flags.favorite = true;
          }
        });
        return searchItems;
      })
    );
  }
 }
