import { Injectable } from '@angular/core';
import { ItemResponse } from '@core/item/item-response.interface';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { ItemCard, ItemCardsWithPagination } from '@public/core/interfaces/item-card.interface';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MapPublishedItemCardService } from '../map-published-item-card/map-published-item-card.service';
import { PublicProfileService } from '../public-profile.service';

@Injectable()
export class PublishedItemCardFavoriteCheckedService {
  constructor(
    private publicProfileService: PublicProfileService,
    private mapPublishedItemCardService: MapPublishedItemCardService,
    private userService: UserService
  ) {}

  public getItems(nextPaginationItem: number): Observable<ItemCardsWithPagination> {
    return forkJoin([
      this.publicProfileService.getPublishedItems(this.publicProfileService.user.id, nextPaginationItem),
      this.isOurOwnPublishedItem(this.publicProfileService.user.id),
    ]).pipe(
      switchMap(([response, isOwner]: [PaginationResponse<ItemResponse>, boolean]) => {
        const recommendedItems$ = isOwner
          ? of(this.mapPublishedItemCardService.mapPublishedItems(response.results))
          : this.mapPublishedItemCardService.mapPublishedItemsFavoriteCheck(response.results);
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

  private isOurOwnPublishedItem(ownerPublishedId: string): Observable<boolean> {
    return this.userService.me().pipe(map((user: User) => user.id === ownerPublishedId));
  }
}
