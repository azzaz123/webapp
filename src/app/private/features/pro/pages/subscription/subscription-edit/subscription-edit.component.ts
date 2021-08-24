import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionPlanDone,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CancelSubscriptionModalComponent } from '@private/features/pro/modal/cancel-subscription/cancel-subscription-modal.component';
import { ModalStatuses } from '@private/features/pro/modal/modal.statuses.enum';
import { finalize } from 'rxjs/operators';

export const PAYMENT_SUCCESSFUL_CODE = 202;

@Component({
  selector: 'tsl-subscription-edit',
  templateUrl: './subscription-edit.component.html',
  styleUrls: ['./subscription-edit.component.scss'],
})
export class SubscriptionEditComponent implements OnInit {
  @Input() subscription: SubscriptionsResponse;
  @Input() user: User;
  @Output() editSuccesful: EventEmitter<string | void> = new EventEmitter();

  public selectedTier: Tier;
  public availableTiers: Tier[];
  public subscribedTier: Tier;
  public benefits: string[];
  public isLoading: boolean;
  public isEqualTier: boolean;
  public showEditSuccessful: boolean;

  constructor(
    private subscriptionsService: SubscriptionsService,
    private modalService: NgbModal,
    private analyticsService: AnalyticsService,
    private benefitsService: SubscriptionBenefitsService,
    private toastService: ToastService,
    private i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.benefits = this.benefitsService.getBenefitsByCategory(this.subscription.category_id);
    this.subscribedTier = this.subscription.tiers.find((tier) => tier.id === this.subscription.selected_tier_id);
    this.selectedTier = this.subscribedTier;
    this.availableTiers = this.subscription.tiers.filter((tier) => tier.id !== this.subscription.selected_tier_id);
    this.checkTier();
  }

  public onSelectedTierChanged(tier: Tier): void {
    this.selectedTier = tier;
    this.checkTier();
  }

  public cancelSubscription(): void {
    let modalRef: NgbModalRef = this.modalService.open(CancelSubscriptionModalComponent, {
      windowClass: 'review',
    });
    modalRef.componentInstance.subscription = this.subscription;
    modalRef.result.then(
      (result: ModalStatuses) => {
        if (result === ModalStatuses.SUCCESS) {
          this.editSuccesful.emit();
        }
      },
      () => {}
    );
  }

  public onRedirectTo(path: string): void {
    this.editSuccesful.emit(path);
  }

  public onPurchaseButtonClick(): void {
    this.trackClickConfirmEdit();
    this.isLoading = true;
    this.subscriptionsService
      .editSubscription(this.subscription, this.selectedTier.id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          if (response.status === PAYMENT_SUCCESSFUL_CODE) {
            this.showEditSuccessful = true;
          } else {
            this.showToastError();
          }
        },
        () => this.showToastError()
      );
  }

  private checkTier(): void {
    this.isEqualTier = this.selectedTier?.id === this.subscribedTier?.id;
  }

  private showToastError(): void {
    this.toastService.show({
      title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_ERROR_TITLE)}`,
      text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_ERROR_BODY)}`,
      type: TOAST_TYPES.ERROR,
    });
  }

  private trackClickConfirmEdit(): void {
    const event: AnalyticsEvent<ClickSubscriptionPlanDone> = {
      name: ANALYTICS_EVENT_NAMES.ClickSubscriptionPlanDone,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        previousTier: this.subscribedTier.id,
        newTier: this.selectedTier.id,
        screenId: SCREEN_IDS.SubscriptionManagement,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
