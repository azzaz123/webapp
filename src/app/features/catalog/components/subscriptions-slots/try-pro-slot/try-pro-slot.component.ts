import { Component, Output, EventEmitter } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  AnalyticsEvent,
  ClickCatalogManagement,
  SCREEN_IDS,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
} from '@core/analytics/analytics-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-try-pro-slot',
  templateUrl: './try-pro-slot.component.html',
  styleUrls: ['./try-pro-slot.component.scss'],
})
export class TryProSlotComponent {
  @Output() close: EventEmitter<void> = new EventEmitter();

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService
  ) {}

  public onClose(): void {
    this.close.emit();
  }

  public onClick(): void {
    const event: AnalyticsEvent<ClickCatalogManagement> = {
      name: ANALYTICS_EVENT_NAMES.ClickCatalogManagement,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog,
      },
    };
    this.router.navigate(['profile/subscriptions']);
  }
}
