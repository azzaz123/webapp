import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionSlot } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscriptions-slots-list',
  templateUrl: './subscriptions-slots-list.component.html',
  styleUrls: ['./subscriptions-slots-list.component.scss'],
})
export class SubscriptionsSlotsListComponent {
  @Input() subscriptionsSlots: SubscriptionSlot[] = [];
  @Input() selectedSubscriptionSlot: SubscriptionSlot = null;
  @Output() subscriptionSlotSelected: EventEmitter<SubscriptionSlot> = new EventEmitter();

  onSelectSubscriptionSlot(subscriptionSlot: SubscriptionSlot) {
    this.subscriptionSlotSelected.emit(subscriptionSlot);
  }
}
