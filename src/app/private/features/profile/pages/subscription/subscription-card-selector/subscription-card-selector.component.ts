import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionResponse } from '@core/subscriptions/subscriptions.interface';

export const test = 'AAAA';

@Component({
  selector: 'tsl-subscription-card-selector',
  templateUrl: './subscription-card-selector.component.html',
  styleUrls: ['./subscription-card-selector.component.scss'],
})
export class SubscriptionCardSelectorComponent implements OnInit {
  @Input() subscription: SubscriptionResponse;

  constructor() {}

  test = test;

  ngOnInit(): void {}
}
