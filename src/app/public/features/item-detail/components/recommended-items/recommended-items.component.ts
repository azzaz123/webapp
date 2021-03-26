import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, ViewItemDetailRecommendationSlider } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { userLocationReducer } from 'app/data/user/store/reducer/location.reducer';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent implements OnChanges, OnInit {
  @Input() recommendedItems: RecommendedItemsBodyResponse;
  @Input() itemSource: Item;
  @Input() itemSourceUser: User;

  public items: Item[];
  public showDescription = false;
  public columnsConfig: ColumnsConfig = {
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2,
  };

  constructor(private mapItemService: MapItemService, private analyticsService: AnalyticsService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.recommendedItems) {
      this.items = this.mapItemService.mapRecommendedItem(this.recommendedItems).slice(0, 6);
      // also send track event?
    }
  }

  // Get recommendedItemIds

  private trackViewItemDetailRecommendationSliderEvent(): void {
    const event: AnalyticsPageView<ViewItemDetailRecommendationSlider> = {
      name: ANALYTICS_EVENT_NAMES.ViewItemDetailRecommendationSlider,
      attributes: {
        itemSourceId: this.itemSource.id,
        categoryId: this.itemSource.categoryId,
        engine: 'more_like_this_solr',
        recommendedItemIds: null, // set at the moment
        screenId: 115,
        isPro: this.itemSourceUser.featured,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}
