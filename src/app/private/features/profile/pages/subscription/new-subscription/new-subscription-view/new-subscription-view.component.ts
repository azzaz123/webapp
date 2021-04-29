import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-new-subscription-view',
  templateUrl: './new-subscription-view.component.html',
  styleUrls: ['./new-subscription-view.component.scss'],
})
export class NewSubscriptionViewComponent implements OnInit {
  @Input() subscription: SubscriptionResponse;
  constructor() {}

  ngOnInit(): void {}
}
