import { Component, OnInit } from '@angular/core';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { ItemCard, ItemCardsWithPagination } from '@public/core/interfaces/item-card.interface';
import { ItemDetailTrackEventsService } from '@public/features/item-detail/core/services/item-detail-track-events/item-detail-track-events.service';
import { EmptyStateProperties } from '@public/shared/components/empty-state/empty-state-properties.interface';
import { finalize, take } from 'rxjs/operators';
import { PublishedItemCardFavouriteCheckedService } from '../../core/services/published-item-card-favourite-checked/published-item-card-favourite-checked.service';

@Component({
  selector: 'tsl-user-published',
  templateUrl: './user-published.component.html',
  styleUrls: ['./user-published.component.scss'],
})
export class UserPublishedComponent implements OnInit {
  public readonly emptyStateProperties: EmptyStateProperties = {
    title: $localize`:@@NoPublishedItemsTitle:Nothing for sale yet`,
    description: $localize`:@@NoPublishedItemsDescription:Seems like someone’s using all they have. Give them time to upload something to wallapop!`,
    illustrationSrc: '/assets/images/commons/flashlight.svg',
  };
  public items: ItemCard[] = [];
  public nextPaginationItem = 0;
  public loading = true;

  constructor(
    private publishedItemCardFavouriteCheckedService: PublishedItemCardFavouriteCheckedService,
    private userService: UserService,
    private itemDetailTrackEventsService: ItemDetailTrackEventsService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  public trackFavouriteOrUnfavouriteEvent(item: ItemCard): void {
    this.userService
      .get(item.ownerId)
      .pipe(take(1))
      .subscribe((user: User) => {
        this.itemDetailTrackEventsService.trackFavouriteOrUnfavouriteEvent(item, user?.featured);
      });
  }

  private loadItems(): void {
    this.loading = true;

    try {
      this.publishedItemCardFavouriteCheckedService
        .getItems(this.nextPaginationItem)
        .pipe(
          finalize(() => (this.loading = false)),
          take(1)
        )
        .subscribe((itemsWithPagination: ItemCardsWithPagination) => {
          this.nextPaginationItem = itemsWithPagination.nextPaginationItem;
          this.items = this.items.concat(itemsWithPagination.items);
        }, this.onError);
    } catch (err: any) {
      this.onError();
    }
  }

  public loadMore(): void {
    this.loadItems();
  }

  private onError(): void {
    this.items = [];
    this.loading = false;
  }
}
