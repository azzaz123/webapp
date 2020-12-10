import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { SubscriptionBenefit } from '../../../core/subscriptions/subscriptions.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-subscription-benefits',
  templateUrl: './subscription-benefits.component.html',
  styleUrls: ['./subscription-benefits.component.scss'],
})
export class SubscriptionBenefitsComponent implements OnInit {
  public loading = true;
  public benefits: SubscriptionBenefit[];

  constructor(private subscriptionService: SubscriptionsService) {}

  ngOnInit() {
    this.subscriptionService
      .getSubscriptionBenefits()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => (this.benefits = response));
  }
}
