import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';

@Component({
  selector: 'tsl-payview-promotion-overview',
  templateUrl: './payview-promotion-overview.component.html',
  styleUrls: ['./payview-promotion-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewPromotionOverviewComponent {
  @Input() public costs: DeliveryBuyerCalculatorCosts;

  constructor(private promotionService: PayviewPromotionService) {}

  public addPromocode(): void {
    this.promotionService.openPromocodeEditor();
  }

  public get isValidPromocode(): boolean {
    return !!this.costs.promotion;
  }

  public get promocode(): string {
    return this.costs.promotion.promocode;
  }

  public removePromocode(): void {
    this.promotionService.removePromocode();
  }

  public get showPromotion(): boolean {
    return !!this.costs;
  }
}
