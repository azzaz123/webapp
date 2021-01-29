import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent {
  @Input() recommendedItems: RecommendedItemsBodyResponse;
  public items: Item[];

  constructor(private mapItemService: MapItemService) {}

  ngOnInit() {
    this.items = this.mapItemService.mapRecommendedItem(this.recommendedItems);
  }
}
