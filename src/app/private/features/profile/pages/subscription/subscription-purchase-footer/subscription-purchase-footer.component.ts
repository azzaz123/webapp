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
  @Output() buttonPurchaseClick: EventEmitter<void> = new EventEmitter();

  public descriptionText: string;
  public buttonText: string;
  public readonly termsAndConditionsURL = TERMS_AND_CONDITIONS_URL;
  public readonly policyPrivacyURL = PRIVACY_POLICY_URL;

  constructor() {}

  ngOnInit(): void {
    this.setButtonText();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedTier && changes.selectedTier.currentValue) {
      this.setDescriptionText();
    }
  }

  private setDescriptionText(): void {
    this.descriptionText = this.subscription.trial_available
      ? $localize`:@@free_days_then_monthly:${this.subscription.trial_days} days free, then ${this.selectedTier.price}${this.selectedTier.currency}/month`
      : $localize`:@@monthly_renewal_plan:The plan will be renewed monthly`;
  }

  private setButtonText(): void {
    this.buttonText = this.subscription.trial_available ? $localize`:@@startFreeTrial:Start free trial` : $localize`:@@pay:Pay`;
  }

  public onClickButton(): void {
    this.buttonPurchaseClick.emit();
  }
}
