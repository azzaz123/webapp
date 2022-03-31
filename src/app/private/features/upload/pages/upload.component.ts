import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCategoryUpload,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { SessionProfileDataLocation } from '@core/trust-and-safety/trust-and-safety.interface';
import { TrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.service';
import { UserService } from '@core/user/user.service';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @ViewChild('scrollPanel', { static: true }) scrollPanel: ElementRef;

  public categoryId: number;
  public CATEGORY_IDS = CATEGORY_IDS;

  constructor(
    private userService: UserService,
    private trustAndSafetyService: TrustAndSafetyService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.userService.isProfessional().subscribe((isProfessional: boolean) => {
      if (isProfessional) {
        this.setCategory(CATEGORY_IDS.CAR);
      }
    });

    this.trustAndSafetyService.submitProfile(SessionProfileDataLocation.OPEN_CREATE_LISTING);
  }

  public setCategory(categoryId: number) {
    this.categoryId = categoryId;
    this.trackEvent();
  }

  public validationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public trackEvent(): void {
    const categorySelected = +this.categoryId;
    const event: AnalyticsEvent<ClickItemCategoryUpload> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCategoryUpload,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.Upload,
        categoryId: categorySelected < 0 ? 0 : categorySelected,
        isPro: this.userService.isPro,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
