import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionSlot } from '../../../../core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscriptions-slot-item',
  templateUrl: './subscriptions-slot-item.component.html',
  styleUrls: ['./subscriptions-slot-item.component.scss']
})
export class SubscriptionsSlotItemComponent implements OnInit {

  @Input() subscriptionSlot: SubscriptionSlot;
  @Input() subscriptionSlotsLength = 1;
  @Input() selectedSubscriptionSlot: SubscriptionSlot = null;
  @Output() selected: EventEmitter<SubscriptionSlot> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  isSelected() {
    if (!this.selectedSubscriptionSlot) {
      return false;
    }
    return this.subscriptionSlot.category.category_id === this.selectedSubscriptionSlot.category.category_id;
  }

  onClick(subscriptionSlot: SubscriptionSlot, e: any) {
    if (subscriptionSlot === this.selectedSubscriptionSlot) {
      this.selected.emit(null);
    } else {
      this.selected.emit(subscriptionSlot);
    }

    if (!subscriptionSlot) {
      e.stopPropagation();
    }
  }

}
