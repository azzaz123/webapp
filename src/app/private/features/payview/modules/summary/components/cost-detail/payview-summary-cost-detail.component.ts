import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';

@Component({
  selector: 'tsl-payview-summary-cost-detail',
  templateUrl: './payview-summary-cost-detail.component.html',
  styleUrls: ['./payview-summary-cost-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewSummaryCostDetailComponent {
  @Input() public costs: DeliveryBuyerCalculatorCosts;
  @Input() public productName: string;

  public get insuranceCost(): string {
    return `${this.costs.buyerCost.fees.amount.toString()}${this.costs.buyerCost.fees.currency.symbol}`;
  }

  public get productCost(): string {
    return `${this.costs.buyerCost.productPrice.amount.toString()}${this.costs.buyerCost.productPrice.currency.symbol}`;
  }

  public get shippingCost(): string {
    return `${this.costs.buyerCost.deliveryCost.amount.toString()}${this.costs.buyerCost.deliveryCost.currency.symbol}`;
  }

  public get showCostDetail(): boolean {
    return !!this.costs && !!this.productName;
  }

  public get totalCost(): string {
    return `${this.costs.buyerCost.total.amount.toString()}${this.costs.buyerCost.total.currency.symbol}`;
  }
}
