import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  AnalyticsEvent,
  ClickCatalogManagement,
  SCREEN_IDS,
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

  public extraBumpsText(quantity: number): string {
    return quantity === 1
      ? $localize`:@@pro_manage_subscriptions_view_active_subscriptions_details_extra_bumps_pending_part_2_text_web_specific.one:Highlight ${quantity}:INTERPOLATION: extra item`
      : $localize`:@@pro_manage_subscriptions_view_active_subscriptions_details_extra_bumps_pending_part_2_text_web_specific.other:Highlight ${quantity}:INTERPOLATION: extra items`;
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
