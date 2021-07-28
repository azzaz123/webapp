import { RECOMMENDATIONS_ENGINE, RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RecommendedItemsInitEventEmitter } from '../../interfaces/recommended-items-init-event-emitter.interface';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
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
export class RecommendedItemsComponent implements AfterViewInit {
  @Input() recommendedItems: ItemCard[];
  @Input() recommendedType: RECOMMENDER_TYPE;
  @Output() initRecommendedItemsSlider: EventEmitter<RecommendedItemsInitEventEmitter> = new EventEmitter();
  @Output() clickedItemAndIndexEvent: EventEmitter<ClickedItemCard> = new EventEmitter<ClickedItemCard>();
  @ViewChild('recommendedItemsSlider', { static: true }) recommendedItemsSlider: ElementRef;

  public items: ItemCard[];
  public showDescription = false;
  public columnsConfig: ColumnsConfig = {
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2,
  };
  private hasEventAlreadySent: boolean;

  constructor(private itemDetailTrackEventsService: ItemDetailTrackEventsService, private userService: UserService) {}

  ngAfterViewInit() {
    if (this.recommendedItems) {
      this.items = this.recommendedItems.slice(0, 6);
      let observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        this.emitInitRecommendedItemsSlider(entries[0].isIntersecting);
      });
      observer.observe(this.recommendedItemsSlider.nativeElement);
    }
  }

  public clickedItemAndIndex(event: ClickedItemCard): void {
    this.clickedItemAndIndexEvent.emit(event);
  }

  public trackFavouriteOrUnfavouriteEvent(item: ItemCard): void {
    if (item.ownerId) {
      this.userService
        .get(item.ownerId)
        .pipe(take(1))
        .subscribe((user: User) => {
          this.itemDetailTrackEventsService.trackFavouriteOrUnfavouriteEvent(item, user?.featured);
        });
    } else {
      this.itemDetailTrackEventsService.trackFavouriteOrUnfavouriteEvent(item);
    }
  }

  private getRecommendedItemIds(items: ItemCard[]): string {
    return items.map((item: ItemCard) => item.id).toString();
  }

  private getRecommendedItemSearchEngine(): RECOMMENDATIONS_ENGINE {
    if (this.recommendedType === RECOMMENDER_TYPE.MORE_LIKE_THIS) {
      return RECOMMENDATIONS_ENGINE.MORE_LIKE_THIS_SOLR;
    } else {
      return RECOMMENDATIONS_ENGINE.COLLABORATIVE_FILTER;
    }
  }

  private emitInitRecommendedItemsSlider(isInView: boolean): void {
    if (isInView && !this.hasEventAlreadySent) {
      this.hasEventAlreadySent = true;
      this.initRecommendedItemsSlider.emit({
        recommendedItemIds: this.getRecommendedItemIds(this.items),
        engine: this.getRecommendedItemSearchEngine(),
      });
    }
  }
}
