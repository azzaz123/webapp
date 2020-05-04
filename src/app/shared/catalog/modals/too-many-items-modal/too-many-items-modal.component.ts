import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { AnalyticsEvent, ClickSubscriptionLimitReached, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, SCREEN_IDS } from '../../../../core/analytics/analytics-constants';
import { AnalyticsService } from '../../../../core/analytics/analytics.service';

@Component({
  selector: 'tsl-too-many-items-modal',
  templateUrl: './too-many-items-modal.component.html',
  styleUrls: ['./too-many-items-modal.component.scss']
})
export class TooManyItemsModalComponent implements OnInit {

  public type = SUBSCRIPTION_TYPES.notSubscribed;
  public notSubscribedType = SUBSCRIPTION_TYPES.notSubscribed;
  public inAppType = SUBSCRIPTION_TYPES.inApp;
  public carDealerType = SUBSCRIPTION_TYPES.carDealer;
  public stripeType = SUBSCRIPTION_TYPES.stripe;

  public categoryName: string;
  public categoryIconName: string;

  constructor(public activeModal: NgbActiveModal,
    private analyticsService: AnalyticsService) { }

  ngOnInit() {
  }

  public trackClickGoToSubscriptions() {
    const event: AnalyticsEvent<ClickSubscriptionLimitReached> = {
      name: ANALYTICS_EVENT_NAMES.ClickSubscriptionLimitReached,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog as 217, // TODO: This is going to be removed when event definition is ok
      }
    };

    this.analyticsService.trackEvent(event);
  }
}
