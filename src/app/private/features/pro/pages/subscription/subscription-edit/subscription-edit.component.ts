import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionAddCard,
  ClickSubscriptionPlanDone,
  SCREEN_IDS,
  SubscriptionPayConfirmation,
  SubscriptionPaymentButtonAvailable,
  ViewSubscriptionTier,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { translations } from '@core/i18n/translations/constants/translations';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PAYMENT_RESPONSE_STATUS } from '@core/payments/payment.service';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { PaymentError, STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { StripeService, STRIPE_PAYMENT_RESPONSE_EVENT_KEY } from '@core/stripe/stripe.service';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SubscriptionResponse, SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from '@private/features/pro/modal/payment-success/payment-success-modal.component';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
import { COMPONENT_TYPE } from '@shared/profile-pro-billing/profile-pro-billing.component';
import { filter, finalize, mergeMap } from 'rxjs/operators';

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
  @Output() editSuccesful: EventEmitter<void> = new EventEmitter();
  @Output() unselectSubcription: EventEmitter<void> = new EventEmitter();

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

  constructor(
    private stripeService: StripeService,
    private errorService: ErrorsService,
    private subscriptionsService: SubscriptionsService,
    private modalService: NgbModal,
    private eventService: EventService,
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
          this.editSuccesful.emit();
          this.toastService.show({
            title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_TITLE)}`,
            text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_BODY)}`,
            type: TOAST_TYPES.SUCCESS,
          });
        } else {
          this.toastService.show({
            title: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_TITLE)}`,
            text: `${this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_EDIT_SUCCESS_BODY)}`,
            type: TOAST_TYPES.ERROR,
          });
        }
      });
  }

  private trackClickConfirmEdit() {
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

  onChageSubscription() {}
}
