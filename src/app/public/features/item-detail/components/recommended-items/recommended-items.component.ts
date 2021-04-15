import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { take } from 'rxjs/operators';
import { ItemDetailTrackEventsService } from '../../core/services/item-detail-track-events/item-detail-track-events.service';
import { ClickedItemCard } from '@public/shared/components/item-card-list/interfaces/clicked-item-card.interface';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent implements OnChanges {
  @Input() recommendedItems: ItemCard[];
  @Input() recommendedType: RECOMMENDER_TYPE;
  @Output() clickedItemAndIndexEvent: EventEmitter<ClickedItemCard> = new EventEmitter<ClickedItemCard>();

  public items: ItemCard[];
  public showDescription = false;
  public columnsConfig: ColumnsConfig = {
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2,
  };

  constructor(private itemDetailTrackEventsService: ItemDetailTrackEventsService, private userService: UserService) {}

  ngOnChanges() {
    if (this.recommendedItems) {
      this.items = this.recommendedItems.slice(0, 6);
    }
  }

  public clickedItemAndIndex(event: ClickedItemCard): void {
    this.clickedItemAndIndexEvent.emit(event);
  }

  public trackFavouriteOrUnfavouriteEvent(item: ItemCard): void {
    this.userService
      .get(item.ownerId)
      .pipe(take(1))
      .subscribe((user: User) => {
        this.itemDetailTrackEventsService.trackFavouriteOrUnfavouriteEvent(item, user?.featured);
      });
  }
}
