import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionSlot } from '@core/subscriptions/subscriptions.interface';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  AnalyticsEvent,
  ClickCatalogManagement,
  SCREEN_IDS,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
} from '@core/analytics/analytics-constants';

@Component({
  selector: 'tsl-subscriptions-slot-item',
  templateUrl: './subscriptions-slot-item.component.html',
  styleUrls: ['./subscriptions-slot-item.component.scss'],
})
export class SubscriptionsSlotItemComponent {
  @Input() subscriptionSlot: SubscriptionSlot;
  @Input() subscriptionSlotsLength = 1;
  @Input() selectedSubscriptionSlot: SubscriptionSlot = null;
  @Output() selected: EventEmitter<SubscriptionSlot> = new EventEmitter();

  constructor(private analyticsService: AnalyticsService) {}

  isSelected() {
    if (!this.selectedSubscriptionSlot) {
      return false;
    }
    return this.subscriptionSlot.category.category_id === this.selectedSubscriptionSlot.category.category_id;
  }

  onClick(subscriptionSlot: SubscriptionSlot, e: any) {
    if (!subscriptionSlot || subscriptionSlot === this.selectedSubscriptionSlot) {
      e.stopPropagation();
      this.selected.emit(null);
    } else {
      this.selected.emit(subscriptionSlot);

      const event: AnalyticsEvent<ClickCatalogManagement> = {
        name: ANALYTICS_EVENT_NAMES.ClickCatalogManagement,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: SCREEN_IDS.MyCatalog,
        },
      };

      this.analyticsService.trackEvent(event);
    }
  }
}
