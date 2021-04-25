import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss'],
})
export class SubscriptionCardComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() textLink: string;
  @Input() textButton: string;
  @Input() hasTrialAvailable: boolean;
  @Output() clickLink: EventEmitter<void> = new EventEmitter();
  @Output() clickButton: EventEmitter<void> = new EventEmitter();

  constructor() {}

  subcriptionBenefits = [
    'Elige cuantos coches vas subir',
    'Comparte tu web y número movil',
    'Gana visibilidad en búsquedas',
    'Ahorra tiempo de gestión',
  ];

  get buttonText(): string {
    return this.hasTrialAvailable ? $localize`:@@startFreeTrial:Start free trial` : $localize`:@@seePlans:See plans`;
  }

  get noSubscriptionBodyText(): string {
    return this.subscription.current_limit
      ? $localize`:@@web_profile_pages_subscription_323:Limit without subscription: ${this.subscription.current_limit}`
      : $localize`:@@web_profile_pages_subscription_586:No limit`;
  }

  get subscriptionBodyText(): string {
    return this.subscription.selected_tier.limit
      ? $localize`:@@web_profile_pages_subscription_325:${this.subscription.selected_tier.limit} products`
      : $localize`:@@web_profile_pages_subscription_586:No limit`;
  }

  get iconSrc(): string {
    const status = this.subscription.subscribed_from ? 'normal' : 'disabled';
    return `/assets/icons/categories/${status}/${this.subscription.category_icon}.svg`;
  }

  public onClickButton(): void {
    this.clickButton.emit();
  }

  public onClickLink(): void {
    this.clickLink.emit();
  }
}
