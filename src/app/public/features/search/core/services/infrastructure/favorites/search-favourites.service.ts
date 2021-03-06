import { Injectable } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ItemFavouritesService } from '@public/core/services/item-favourites/item-favourites.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class SearchFavouritesService {

  constructor(private itemFavouritesService: ItemFavouritesService) {}

  getFavouritesByItems(searchItems: ItemCard[]): Observable<ItemCard[]> {
    const searchItemIds: string[] = searchItems.map(({id}) => id);
    return this.itemFavouritesService.getFavouritedItemIds(searchItemIds).pipe(
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
