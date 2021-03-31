import { Component, Input, OnChanges } from '@angular/core';
import { Item } from '@core/item/item';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent implements OnChanges {
  @Input() recommendedItems: RecommendedItemsBodyResponse;
  public items: Item[];
  public showDescription = false;
  public columnsConfig: ColumnsConfig = {
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2,
  };

  constructor(private mapItemService: MapItemService) {}

  ngOnChanges() {
    if (this.recommendedItems) {
      this.items = this.mapItemService.mapRecommendedItem(this.recommendedItems).slice(0, 6);
    }
  }

  public clickedItemAndIndex(event: { item: Item; index: Number }) {}
}
