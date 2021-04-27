import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionCardComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() textLink: string;
  @Input() hasTrialAvailable: boolean;
  @Input() isSuscribed: boolean;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();

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
    const status = this.isSuscribed ? 'normal' : 'disabled';
    return `/assets/icons/categories/${status}/${this.subscription.category_icon}.svg`;
  }

  public onButtonClick(): void {
    this.buttonClick.emit();
  }
}
