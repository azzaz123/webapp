import { Component, Input, OnChanges } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card-core.interface';
import { RecommenderItem } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent implements OnChanges {
  @Input() recommendedItems: RecommenderItem[];
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
    }
  }
}
