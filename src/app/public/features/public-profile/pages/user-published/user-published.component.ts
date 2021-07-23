import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { EmptyStateProperties } from '@public/shared/components/empty-state/empty-state-properties.interface';
import { ClickedItemCard } from '@public/shared/components/item-card-list/interfaces/clicked-item-card.interface';
import { finalize, take } from 'rxjs/operators';
import { PublicProfileTrackingEventsService } from '../../core/services/public-profile-tracking-events/public-profile-tracking-events.service';
import { CatalogApiService } from '@api/catalog/catalog-api.service';
import { ActivatedRoute } from '@angular/router';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { Subscription } from 'rxjs';
import { SlugsUtilService } from '@core/services/slugs-util/slugs-util.service';
import { PaginatedList } from '@api/core/model';

@Component({
  selector: 'tsl-user-published',
  templateUrl: './user-published.component.html',
  styleUrls: ['./user-published.component.scss'],
})
export class UserPublishedComponent implements OnInit, OnDestroy {
  public readonly emptyStateProperties: EmptyStateProperties = {
    title: $localize`:@@web_no_published_items_title:Nothing for sale yet`,
    description: $localize`:@@web_no_published_items_description:Seems like someone’s using all they have. Give them time to upload something to wallapop!`,
    illustrationSrc: '/assets/images/commons/flashlight.svg',
  };
  public items: ItemCard[] = [];
  public paginationParameter: string;
  public loading = true;

  private subscriptions = new Subscription();
  private userId: string;

  constructor(
    private catalogApiService: CatalogApiService,
    private publicProfileTrackingEventsService: PublicProfileTrackingEventsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private slugsUtilService: SlugsUtilService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(this.routeParamsSubscription());
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private routeParamsSubscription(): Subscription {
    return this.route.parent.params.subscribe((params) => {
      const webSlug = params[PUBLIC_PATH_PARAMS.WEBSLUG];
      this.userId = this.slugsUtilService.getUUIDfromSlug(webSlug);
      this.loadItems();
    });
  }

  public toggleFavourite(itemCard: ItemCard): void {
    if (itemCard.ownerId) {
      this.userService
        .get(itemCard.ownerId)
        .pipe(take(1))
        .subscribe((user: User) => {
          this.publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteItemEvent(itemCard, user);
        });
    } else {
      this.publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteItemEvent(itemCard);
    }
  }

  private loadItems(): void {
    this.loading = true;
    const shouldCheckForFavourites = this.userService.isLogged && !this.userService.isCurrentUser(this.userId);

    try {
      this.catalogApiService
        .getUserPublishedItems(this.userId, shouldCheckForFavourites, this.paginationParameter)
        .pipe(
          finalize(() => (this.loading = false)),
          take(1)
        )
        .subscribe(({ list, paginationParameter }: PaginatedList<ItemCard>) => {
          this.items = this.items.concat(list);
          this.paginationParameter = paginationParameter;
        }, this.onError);
    } catch (err: any) {
      this.onError();
    }
  }

  public loadMore(): void {
    this.loadItems();
  }

  public itemCardClicked({ itemCard, index }: ClickedItemCard): void {
    if (itemCard.ownerId) {
      this.userService.get(itemCard.ownerId).subscribe((user: User) => {
        this.publicProfileTrackingEventsService.trackClickItemCardEvent(itemCard, index, user);
      });
    } else {
      this.publicProfileTrackingEventsService.trackClickItemCardEvent(itemCard, index);
    }
  }

  private onError(): void {
    this.items = [];
    this.loading = false;
  }
}
