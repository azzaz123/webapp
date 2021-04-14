import { RECOMMENDATIONS_ENGINE, RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';
import { RecommendedItemsInitEventEmitter } from '../../interfaces/recommended-items-init-event-emitter.interface';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
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
  private isInview: boolean = false;

  constructor(private mapRecommendedItemCardService: MapRecommendedItemCardService) {}

  ngAfterViewInit() {
    if (this.recommendedItems) {
      this.items = this.recommendedItems.slice(0, 6);
    }
  }

  public clickedItemAndIndex(event: ClickedItemCard): void {
    this.clickedItemAndIndexEvent.emit(event);
  }

  private getRecommendedItemIds(items: ItemCard[]): string {
    return items.map((item: ItemCard) => item.id).toString();
  }

  private getRecommendedItemSearchEngine(): RECOMMENDATIONS_ENGINE {
    if (this.recommendedItems[0].recommended_type === RECOMMENDER_TYPE.MORE_LIKE_THIS) {
      return RECOMMENDATIONS_ENGINE.MORE_LIKE_THIS_SOLR;
    } else {
      return RECOMMENDATIONS_ENGINE.COLLABORATIVE_FILTER;
    }
  }

  private checkIsRecommenderSliderVisible(element: Element): void {
    const rect = element.getBoundingClientRect();
    const viewportWidth: number = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight: number = window.innerHeight || document.documentElement.clientHeight;
    if (rect.right < 0 || rect.bottom < 0 || rect.left > viewportWidth || rect.top > viewportHeight) {
      return;
    }
    if (!this.isInview) {
      this.initRecommendedItemsSlider.emit({
        recommendedItemIds: this.getRecommendedItemIds(this.items),
        engine: this.getRecommendedItemSearchEngine(),
      });
    }
    this.isInview = true;
  }

  @HostListener('window:scroll', ['$event']) onScroll(): void {
    this.checkIsRecommenderSliderVisible(this.recommendedItemsSlider.nativeElement);
  }
}
