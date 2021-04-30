import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionResponse, SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-tier-selector',
  templateUrl: './subscription-tier-selector.component.html',
  styleUrls: ['./subscription-tier-selector.component.scss'],
})
export class SubscriptionTierSelectorComponent implements OnInit {
  @Input() subscription: SubscriptionsResponse;

  constructor() {}

  ngOnInit(): void {}
}
