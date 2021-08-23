import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionPlanDone,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CancelSubscriptionModalComponent } from '@private/features/pro/modal/cancel-subscription/cancel-subscription-modal.component';
import { ModalStatuses } from '@private/features/pro/modal/modal.statuses.enum';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
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
  @Input() editMode: boolean;
  @Output() editSuccesful: EventEmitter<string> = new EventEmitter();

  public stripeCards: FinancialCard[];
  public selectedCard: FinancialCard;
  public isInvoiceRequired = false;
  public selectedTier: Tier;
  public availableTiers: Tier[];
  public subscribedTier: Tier;
  public paymentError: STRIPE_ERROR;
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
    this.subscribedTier = this.subscription.tiers.find((tier) => tier.id === this.subscription.selected_tier_id);
    this.selectedTier = this.subscribedTier;
    this.availableTiers = this.subscription.tiers.filter((tier) => tier.id !== this.subscription.selected_tier_id);
    this.benefits = this.benefitsService.getBenefitsByCategory(this.subscription.category_id);
    this.checkTier();
  }

  public onSelectedTierChanged(tier: Tier): void {
    this.selectedTier = tier;
    this.checkTier();
  }

  private checkTier() {
    this.isEqualTier = this.selectedTier.id === this.subscribedTier.id;
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
      .subscribe((response) => {
        if (response.status === PAYMENT_SUCCESSFUL_CODE) {
          this.showEditSuccessful = true;
        } else {
          this.toastService.show({
            title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_TITLE)}`,
            text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_BODY)}`,
            type: TOAST_TYPES.ERROR,
          });
        }
      });
  }

  public onRedirectTo(path: string) {
    this.editSuccesful.emit(path);
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
}
