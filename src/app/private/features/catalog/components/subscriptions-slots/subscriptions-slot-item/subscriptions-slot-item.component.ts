import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  AnalyticsEvent,
  ClickCatalogManagement,
  SCREEN_IDS,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
} from '@core/analytics/analytics-constants';
import { SubscriptionSlot } from '@api/core/model/subscriptions/slots/subscription-slot.interface';

@Component({
  selector: 'tsl-subscriptions-slot-item',
  templateUrl: './subscriptions-slot-item.component.html',
  styleUrls: ['./subscriptions-slot-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionsSlotItemComponent implements OnChanges {
  @Input() subscriptionSlot: SubscriptionSlot;
  @Input() selectedSubscriptionSlot: SubscriptionSlot;
  @Output() selected: EventEmitter<SubscriptionSlot> = new EventEmitter();

  public isSelected: boolean;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnChanges() {
    this.checkIsSelected();
  }

  public onClick(subscriptionSlot: SubscriptionSlot, e: any): void {
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

  private checkIsSelected(): void {
    if (!this.selectedSubscriptionSlot) {
      this.isSelected = false;
      return;
    }
    this.isSelected = this.subscriptionSlot.subscription.type === this.selectedSubscriptionSlot.subscription.type;
  }
}
