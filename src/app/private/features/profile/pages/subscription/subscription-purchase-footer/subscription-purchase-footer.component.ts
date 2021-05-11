import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from '@core/constants';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from '@core/subscriptions/subscriptions.interface';
import { DeviceDetectorService } from 'ngx-device-detector';

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

  descriptionText: string;

  public termsAndConditionsURL = TERMS_AND_CONDITIONS_URL;
  public policyPrivacyURL = PRIVACY_POLICY_URL;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.descriptionText = this.subscription.trial_available
      ? $localize`:@@web_profile_pages_subscription_1000:${this.subscription.trial_days} days free, then ${this.selectedTier.price}${this.selectedTier.currency}/month`
      : $localize`:@@web_profile_pages_subscription_1500:${this.selectedTier.price}${this.selectedTier.currency}/month`;
  }

  public onClickButton() {
    this.buttonPurchaseClick.emit();
  }
}
