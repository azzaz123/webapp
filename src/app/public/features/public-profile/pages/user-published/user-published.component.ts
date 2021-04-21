import { Component, OnInit } from '@angular/core';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { ItemCard, ItemCardsWithPagination } from '@public/core/interfaces/item-card.interface';
import { EmptyStateProperties } from '@public/shared/components/empty-state/empty-state-properties.interface';
import { ClickedItemCard } from '@public/shared/components/item-card-list/interfaces/clicked-item-card.interface';
import { finalize, take } from 'rxjs/operators';
import { PublicProfileTrackingEventsService } from '../../core/services/public-profile-tracking-events/public-profile-tracking-events.service';
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
    private publicProfileTrackingEventsService: PublicProfileTrackingEventsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadItems();
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

  public itemCardClicked({ itemCard, index }: ClickedItemCard): void {
    this.userService.get(itemCard.ownerId).subscribe((user: User) => {
      this.publicProfileTrackingEventsService.trackClickItemCardEvent(itemCard, user, index);
    });
  }

  private onError(): void {
    this.items = [];
    this.loading = false;
  }
}
