import { Component, Input } from '@angular/core';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';

@Component({
  selector: 'tsl-pro-header',
  templateUrl: './pro-header.component.html',
  styleUrls: ['./pro-header.component.scss'],
})
export class ProHeaderComponent {
  @Input() showBenefits: boolean;

  constructor(private subscriptionBenefits: SubscriptionBenefitsService) {}

  get benefits$() {
    return this.subscriptionBenefits.getSubscriptionsHeaderBenefits();
  }
}
