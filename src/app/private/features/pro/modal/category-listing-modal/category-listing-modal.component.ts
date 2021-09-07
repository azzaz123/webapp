import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SCREEN_IDS,
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickConfirmCloseSubscription,
} from '@core/analytics/analytics-constants';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ModalStatuses } from '../modal.statuses.enum';
import { CategoryService } from '@core/category/category.service';
import { take } from 'rxjs/operators';
import { CategoryResponse } from '@core/category/category-response.interface';

@Component({
  selector: 'tsl-category-listing-modal',
  templateUrl: './category-listing-modal.component.html',
  styleUrls: ['./category-listing-modal.component.scss'],
})
export class CategoryListingModalComponent implements OnInit {
  public loading = false;
  public subscription: SubscriptionsResponse;
  public categories: CategoryResponse[] = [];

  constructor(public activeModal: NgbActiveModal, private i18n: I18nService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.subscription.category_ids.forEach((id) => {
      this.categoryService
        .getCategoryById(id)
        .pipe(take(1))
        .subscribe((category) => {
          this.categories.push({
            ...category,
            icon_id: `/assets/icons/filters/categories/${category.icon_id}.svg`,
          });
        });
    });
    console.log('test', this.categories);
  }
}
