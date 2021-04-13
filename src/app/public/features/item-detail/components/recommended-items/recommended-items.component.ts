import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { User } from '@core/user/user';
import { UserResponse } from '@core/user/user-response.interface';
import { UserService } from '@core/user/user.service';
import { ItemCard } from '@public/core/interfaces/item-card-core.interface';
import { RecommenderItem } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { ClickedItemCard } from '@public/shared/components/item-card-list/interfaces/clicked-item-card.interface';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { take } from 'rxjs/operators';
import { ItemDetailTrackEventsService } from '../../core/services/item-detail-track-events/item-detail-track-events.service';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent implements OnChanges {
  @Input() recommendedItems: RecommenderItem[];
  @Output() clickedItemAndIndexEvent: EventEmitter<ClickedItemCard> = new EventEmitter<ClickedItemCard>();

  public items: ItemCard[];
  public showDescription = false;
  public columnsConfig: ColumnsConfig = {
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2,
  };

  constructor(
    private mapRecommendedItemCardService: MapRecommendedItemCardService,
    private itemDetailTrackEventsService: ItemDetailTrackEventsService,
    private userService: UserService
  ) {}

  ngOnChanges() {
    if (this.recommendedItems) {
      this.items = this.mapRecommendedItemCardService.mapRecommendedItems(this.recommendedItems).slice(0, 6);
    }
  }

  public clickedItemAndIndex(event: ClickedItemCard): void {
    this.clickedItemAndIndexEvent.emit(event);
  }

  public trackFavoriteOrUnfavoriteEvent(item: ItemCard): void {
    this.userService
      .get(item.ownerId)
      .pipe(take(1))
      .subscribe((user: User) => {
        this.itemDetailTrackEventsService.trackFavoriteOrUnfavoriteEvent(item, user?.featured);
      });
  }
}
