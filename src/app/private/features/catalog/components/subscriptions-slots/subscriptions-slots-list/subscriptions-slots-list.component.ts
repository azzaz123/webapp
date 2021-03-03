import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionSlot } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscriptions-slots-list',
  templateUrl: './subscriptions-slots-list.component.html',
  styleUrls: ['./subscriptions-slots-list.component.scss'],
})
export class SubscriptionsSlotsListComponent implements OnInit {
  @Input() subscriptionsSlots: SubscriptionSlot[] = [];
  @Input() selectedSubscriptionSlot: SubscriptionSlot = null;
  @Output() subscriptionSlotSelected: EventEmitter<SubscriptionSlot> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onSelectSubscriptionSlot(subscriptionSlot: SubscriptionSlot) {
    this.subscriptionSlotSelected.emit(subscriptionSlot);
  }
}
