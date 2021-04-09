import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { RECOMMENDER_TYPE, SEARCH_TECHNIQUE_ENGINE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { ItemCard } from '@public/core/interfaces/item-card-core.interface';
import { RecommenderItem } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';
import { RecommendedItemsInitEventEmitter } from '../../interfaces/recommended-items-init-event-emitter.interface';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent implements OnChanges {
  @Input() recommendedItems: RecommenderItem[];
  @Output() initRecommendedItemsSlider: EventEmitter<RecommendedItemsInitEventEmitter> = new EventEmitter();
  public items: ItemCard[];
  public showDescription = false;
  public columnsConfig: ColumnsConfig = {
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2,
  };

  constructor(private mapRecommendedItemCardService: MapRecommendedItemCardService) {}

  ngOnChanges() {
    if (this.recommendedItems) {
      this.items = this.mapRecommendedItemCardService.mapRecommendedItems(this.recommendedItems).slice(0, 6);
      this.initRecommendedItemsSlider.emit({
        recommendedItemIds: this.getRecommendedItemIds(this.items),
        engine: this.getRecommendedItemSearchEngine(),
      });
    }
  }

  private getRecommendedItemIds(items: ItemCard[]): string {
    return items.map((item: ItemCard) => item.id).toString();
  }

  private getRecommendedItemSearchEngine(): SEARCH_TECHNIQUE_ENGINE {
    if (this.recommendedItems[0].recommended_type === RECOMMENDER_TYPE.MORE_LIKE_THIS) {
      return SEARCH_TECHNIQUE_ENGINE.MORE_LIKE_THIS_SOLR;
    } else {
      return SEARCH_TECHNIQUE_ENGINE.COLLABORATIVE_FILTER;
    }
  }
}
