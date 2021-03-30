import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin } from 'rxjs';

import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { ItemService } from '../../../../core/item/item.service';
import { SubscriptionsService } from '../../../../core/subscriptions/subscriptions.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES } from '../../../../core/subscriptions/subscriptions.interface';
import { map } from 'rxjs/operators';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { AnalyticsPageView, ViewProSubscriptionPopup, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from 'app/core/analytics/analytics-constants';

@Component({
  selector: 'tsl-suggest-pro-modal',
  templateUrl: './suggest-pro-modal.component.html',
  styleUrls: ['./suggest-pro-modal.component.scss'],
})
export class SuggestProModalComponent implements OnInit {
  @Input() isFreeTrial: boolean;
  @Input() title: string;

  constructor(public activeModal: NgbActiveModal, private itemService: ItemService, private subscriptionsService: SubscriptionsService) {}

  ngOnInit() {}

  get buttonText(): string {
    return this.isFreeTrial ? $localize`:@@startFreeTrial:Start free trial` : $localize`:@@seePlans:See plans`;
  }

  get descriptionText(): string {
    return this.isFreeTrial
      ? $localize`:@@SuggestProModalescriptionTrial:Try Wallapop PRO for free and explore all their benefits.`
      : $localize`:@@SuggestProModalescriptionPlans:Choose a plan and take advantage of Wallapop PRO benefits.`;
  }
}
