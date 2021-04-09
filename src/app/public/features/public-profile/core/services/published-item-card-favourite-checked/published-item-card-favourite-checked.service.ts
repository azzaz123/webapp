import { Injectable } from '@angular/core';
import { ItemCard, ItemsCardsWithPagination } from '@public/core/interfaces/item-card.interface';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MapPublishedItemCardService } from '../map-published-item-card/map-published-item-card.service';
import { PublicProfileService } from '../public-profile.service';

@Injectable()
export class PublishedItemCardFavouriteCheckedService {
  constructor(private publicProfileService: PublicProfileService, private mapPublishedItemCardService: MapPublishedItemCardService) {}

  public getItems(nextPaginationItem: number): Observable<ItemsCardsWithPagination> {
    return this.publicProfileService.getPublishedItems(this.publicProfileService.user.id, nextPaginationItem).pipe(
      switchMap((response) => {
        return forkJoin([of(response.init), this.mapPublishedItemCardService.mapPublishedItems(response.results)]).pipe(
          map(([nextPaginationItem, items]) => {
            return {
              nextPaginationItem,
              items,
            };
          })
        );
      })
    );
  }
}
