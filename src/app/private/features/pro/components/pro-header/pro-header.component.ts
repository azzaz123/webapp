import { Component, Input } from '@angular/core';
import { SubscriptionBenefit } from '@core/subscriptions/subscription-benefits/interfaces/subscription-benefit.interface';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tsl-pro-header',
  templateUrl: './pro-header.component.html',
  styleUrls: ['./pro-header.component.scss'],
})
export class ProHeaderComponent {
  @Input() showBenefits: boolean;

  constructor(private subscriptionBenefits: SubscriptionBenefitsService) {}

  public get benefits$(): Observable<SubscriptionBenefit[]> {
    return this.subscriptionBenefits.getSubscriptionsHeaderBenefits();
  }
}
