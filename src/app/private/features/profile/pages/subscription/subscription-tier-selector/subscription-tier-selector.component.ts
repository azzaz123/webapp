import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-tier-selector',
  templateUrl: './subscription-tier-selector.component.html',
  styleUrls: ['./subscription-tier-selector.component.scss'],
})
export class SubscriptionTierSelectorComponent implements OnInit {
  @Input() subscription: SubscriptionsResponse;
  @Input() selectedTier: Tier;
  @Output() changeSelectedTier: EventEmitter<Tier> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onTierSelectedChanged(event: Tier) {
    this.changeSelectedTier.emit(event);
  }
}
