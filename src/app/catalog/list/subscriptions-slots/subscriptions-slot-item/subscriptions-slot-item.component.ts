import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionSlot } from '../../../../core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscriptions-slot-item',
  templateUrl: './subscriptions-slot-item.component.html',
  styleUrls: ['./subscriptions-slot-item.component.scss']
})
export class SubscriptionsSlotItemComponent implements OnInit {

  @Input() subscriptionSlot: SubscriptionSlot;
  @Input() selectedSubscriptionSlot: SubscriptionSlot = null;
  @Output() selected: EventEmitter<SubscriptionSlot> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  isSelected() {
    if (!this.selectedSubscriptionSlot) {
      return false;
    }
    return this.subscriptionSlot.category.categoryId === this.selectedSubscriptionSlot.category.categoryId;
  }

  onClick(subscriptionSlot: SubscriptionSlot, e: any) {
    this.selected.emit(subscriptionSlot);

    if (!subscriptionSlot) {
      e.stopPropagation();
    }
  }

}
