import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { Money } from '@api/core/model/money.interface';

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
    return this.getFormatAmount(this.costs.buyerCost.fees);
  }

  public get insuranceDiscount(): string {
    return this.getFormatAmount(this.costs.promotion.originalBuyerCost.fees);
  }

  public get insuranceBadge(): string {
    if (this.costs.promotion.promocode) {
      return this.costs.promotion.promocode;
    }
    return this.isFreeInsurance
      ? $localize`:@@pay_view_buyer_summary_payment_free_badge:Free`
      : this.getFormatAmount(this.costs.promotion.feesFixedPrice);
  }

  public get shippingBadge(): string {
    if (this.costs.promotion.promocode) {
      return this.costs.promotion.promocode;
    }
    return this.isFreeShipping
      ? $localize`:@@pay_view_buyer_summary_payment_free_badge:Free`
      : this.isPercentageShippingDiscount
      ? this.getFormatPercentage(this.costs.promotion.deliveryCostDiscountPercentage)
      : this.getFormatAmount(this.costs.promotion.deliveryCostFixedPrice);
  }

  public get isInsuranceDiscount(): boolean {
    return !!this.costs.promotion?.feesFixedPrice;
  }

  public get isPercentageShippingDiscount(): boolean {
    return this.costs.promotion?.deliveryCostDiscountPercentage > 0;
  }

  public get isShippingDiscount(): boolean {
    return !!this.costs.promotion?.deliveryCostFixedPrice || this.isPercentageShippingDiscount;
  }

  public get productCost(): string {
    return this.getFormatAmount(this.costs.buyerCost.productPrice);
  }

  public get shippingCost(): string {
    return this.getFormatAmount(this.costs.buyerCost.deliveryCost);
  }

  public get shippingDiscount(): string {
    return this.getFormatAmount(this.costs.promotion.originalBuyerCost.deliveryCost);
  }

  public get showCostDetail(): boolean {
    return !!this.costs && !!this.productName;
  }

  public get totalCost(): string {
    return this.getFormatAmount(this.costs.buyerCost.total);
  }

  private getFormatAmount(value: Money): string {
    return `${value.toString()}`;
  }

  private getFormatPercentage(value: number): string {
    return `${value.toString()}%`;
  }

  private get isFreeInsurance(): boolean {
    return this.costs.promotion.feesFixedPrice.amount.total === 0;
  }

  private get isFreeShipping(): boolean {
    return this.costs.promotion.deliveryCostFixedPrice?.amount.total === 0 || this.isFullPercentage;
  }

  private get isFullPercentage(): boolean {
    return this.costs.promotion.deliveryCostDiscountPercentage === 100;
  }
}
