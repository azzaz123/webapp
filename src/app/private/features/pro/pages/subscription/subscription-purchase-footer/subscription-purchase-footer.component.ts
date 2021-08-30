import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from '@core/constants';
import { SubscriptionsResponse, Tier } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-purchase-footer',
  templateUrl: './subscription-purchase-footer.component.html',
  styleUrls: ['./subscription-purchase-footer.component.scss'],
})
export class SubscriptionPurchaseFooterComponent implements OnInit, OnChanges {
  @Input() selectedTier: Tier;
  @Input() buttonDisable: boolean;
  @Input() subscription: SubscriptionsResponse;
  @Input() isLoading: boolean;
  @Input() isEdit: boolean;
  @Output() buttonPurchaseClick: EventEmitter<void> = new EventEmitter();
  @Output() buttonEnabled: EventEmitter<void> = new EventEmitter();

  public descriptionText: string;
  public buttonText: string;
  public priceText: string;
  public readonly termsAndConditionsURL = TERMS_AND_CONDITIONS_URL;
  public readonly policyPrivacyURL = PRIVACY_POLICY_URL;

  constructor() {}

  ngOnInit(): void {
    this.setButtonText();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { buttonDisable, selectedTier } = changes;
    if (buttonDisable && !buttonDisable.currentValue && buttonDisable.currentValue !== buttonDisable.previousValue) {
      this.buttonEnabled.emit();
    }
    if (selectedTier) {
      this.setPriceText();
    }
  }

  public onClickButton(): void {
    if (!this.buttonDisable && !this.isLoading) {
      this.buttonPurchaseClick.emit();
    }
  }

  private setButtonText(): void {
    if (this.isEdit) {
      this.buttonText = $localize`:@@pro_subscriptions_purchase_summary_change_plan_apply_button:Continue and change`;
      return;
    }

    if (this.subscription.trial_available) {
      this.buttonText = $localize`:@@web_start_free_trial:Start free trial`;
      return;
    }

    this.buttonText = this.selectedTier.discount
      ? $localize`:@@pro_subscription_purchase_try_discount_button:Try with discount`
      : $localize`:@@web_pay:Pay`;
  }

  private setPriceText(): void {
    this.priceText = `${this.subscription.trial_available ? '0,00' : this.selectedTier.price}`;
  }
}
