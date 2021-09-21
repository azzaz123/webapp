import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionSlot } from '@api/catalog-manager/interfaces/subscription-slot/subscription-slot.interface';

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
