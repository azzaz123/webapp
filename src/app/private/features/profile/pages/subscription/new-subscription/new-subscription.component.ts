import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-new-subscription',
  templateUrl: './new-subscription.component.html',
  styleUrls: ['./new-subscription.component.scss'],
})
export class NewSubscriptionComponent implements OnInit {
  @Input() subscription: SubscriptionResponse;
  constructor() {}

  ngOnInit(): void {}
}
