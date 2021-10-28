import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionBenefit } from '@core/subscriptions/subscription-benefits/interfaces/subscription-benefit.interface';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tsl-pro-header',
  templateUrl: './pro-header.component.html',
  styleUrls: ['./pro-header.component.scss'],
})
export class ProHeaderComponent {
  @Input() isProUser;
  public benefits$: Observable<SubscriptionBenefit[]>;

  constructor(private subscriptionBenefits: SubscriptionBenefitsService) {
    this.benefits$ = this.subscriptionBenefits.getSubscriptionsHeaderBenefits();
  }
}
