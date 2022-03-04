import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

@Component({
  selector: 'tsl-payview-promotion-overview',
  templateUrl: './payview-promotion-overview.component.html',
  styleUrls: ['./payview-promotion-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewPromotionOverviewComponent {
  @Input() public payviewState: PayviewState;

  constructor(private promotionService: PayviewPromotionService) {}

  public addPromocode(): void {
    this.promotionService.openPromocodeEditor();
  }

  public get isValidPromocode(): boolean {
    return !!this.payviewState.costs.promotion;
  }

  public get showPromotion(): boolean {
    return !!this.payviewState;
  }
}
