import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ANALYTICS_EVENT_NAMES, AnalyticsPageView, ViewItemDetailRecommendationSlider } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { SEARCH_TECHNIQUE_ENGINE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent implements OnInit {
  @Input() recommendedItems: RecommendedItemsBodyResponse;
  @Output() initRecommendedItemsSlider: EventEmitter<{ recommendedItemIds: string; engine: SEARCH_TECHNIQUE_ENGINE }> = new EventEmitter();
  public items: Item[];
  public showDescription = false;
  public columnsConfig: ColumnsConfig = {
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2,
  };

  constructor(private mapItemService: MapItemService) {}

  ngOnInit() {
    if (this.recommendedItems) {
      this.items = this.mapItemService.mapRecommendedItem(this.recommendedItems).slice(0, 6);
      this.initRecommendedItemsSlider.emit({
        recommendedItemIds: this.getRecommendedItemIds(this.items),
        engine: this.getRecommendedItemSearchEngine(),
      });
    }
  }

  private getRecommendedItemIds(items: Item[]): string {
    return items.map((item: Item) => item.id).toString();
  }

  private getRecommendedItemSearchEngine(): SEARCH_TECHNIQUE_ENGINE {
    // do the logic
    return SEARCH_TECHNIQUE_ENGINE.MORE_LIKE_THIS_SOLR;
  }
}
