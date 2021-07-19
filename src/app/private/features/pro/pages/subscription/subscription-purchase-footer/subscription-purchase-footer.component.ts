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
    this.buttonText = this.subscription.trial_available ? $localize`:@@web_start_free_trial:Start free trial` : $localize`:@@web_pay:Pay`;
  }

  private setPriceText(): void {
    this.priceText = `${this.subscription.trial_available ? '0,00' : this.selectedTier.price}`;
  }
}
