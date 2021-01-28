import { Component, Input } from '@angular/core';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';

@Component({
  selector: 'tsl-recommended-items',
  templateUrl: './recommended-items.component.html',
  styleUrls: ['./recommended-items.component.scss'],
})
export class RecommendedItemsComponent {
  @Input() recommendedItems: RecommendedItemsBodyResponse;

  constructor() {}
}
