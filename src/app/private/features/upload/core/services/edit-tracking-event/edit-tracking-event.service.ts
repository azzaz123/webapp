import { Injectable } from '@angular/core';
import { ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewEditItem, AnalyticsPageView } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Observable } from 'rxjs';

@Injectable()
export class EditTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

  public get viewTrackingReady$(): Observable<void> {
    return this.analyticsService.mParticleReady$;
  }

  public trackViewEditItemEvent(categoryId: number, mandatoryAdditionalFields: boolean): void {
    const event: AnalyticsPageView<ViewEditItem> = {
      name: ANALYTICS_EVENT_NAMES.ViewEditItem,
      attributes: {
        screenId: SCREEN_IDS.Upload,
        categoryId,
        mandatoryAdditionalFields,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}
