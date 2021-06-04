import { Injectable } from '@angular/core';
import { ItemResponse } from '@core/item/item-response.interface';
import { ItemCard, ItemCardsWithPagination } from '@public/core/interfaces/item-card.interface';
import { IsCurrentUserPipe } from '@public/core/pipes/is-current-user/is-current-user.pipe';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MapPublishedItemCardService } from '../map-published-item-card/map-published-item-card.service';
import { PublicProfileService } from '../public-profile.service';

@Injectable()
export class PublishedItemCardFavouriteCheckedService {
  constructor(
    private publicProfileService: PublicProfileService,
    private mapPublishedItemCardService: MapPublishedItemCardService,
    private isCurrentUser: IsCurrentUserPipe
  ) {}

  public getItems(nextPaginationItem: number): Observable<ItemCardsWithPagination> {
    return this.publicProfileService.getPublishedItems(this.publicProfileService.user.id, nextPaginationItem).pipe(
      switchMap((response: PaginationResponse<ItemResponse>) => {
        const isOwner = this.isOurOwnPublishedItem(this.publicProfileService.user.id);
        const recommendedItems$ = isOwner
          ? of(this.mapPublishedItemCardService.mapPublishedItems(response.results))
          : this.mapPublishedItemCardService.mapPublishedItemsFavouriteCheck(response.results);

        return forkJoin([of(response.init), recommendedItems$]).pipe(
          map(([nextPaginationItem, items]: [number, ItemCard[]]) => {
            return {
              nextPaginationItem,
              items,
            };
          })
        );
      })
    );
  }

  private isOurOwnPublishedItem(ownerPublishedId: string): boolean {
    return this.isCurrentUser.transform(ownerPublishedId);
  }
}
