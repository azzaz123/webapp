import { Component, Input } from '@angular/core';
import { Tier } from '@core/subscriptions/subscriptions.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-suggest-pro-modal',
  templateUrl: './suggest-pro-modal.component.html',
  styleUrls: ['./suggest-pro-modal.component.scss'],
})
export class SuggestProModalComponent {
  @Input() isFreeTrial: boolean;
  @Input() tierWithDiscount: Tier;
  @Input() title: string;

  constructor(public activeModal: NgbActiveModal) {}

  get buttonText(): string {
    if (this.isFreeTrial) {
      return $localize`:@@web_start_free_trial:Start free trial`;
    }
    return this.tierWithDiscount
      ? $localize`:@@pro_after_reactivation_non_subscribed_user_start_with_discount_button:Start with ${this.tierWithDiscount.discount.percentage}:INTERPOLATION:% discount`
      : $localize`:@@web_see_plans:See plans`;
  }

  get descriptionText(): string {
    return this.isFreeTrial
      ? $localize`:@@web_suggest_pro_modal_description_trial:Try Wallapop PRO for free and explore all their benefits.`
      : $localize`:@@web_suggest_pro_modal_description_plans:Choose a plan and take advantage of Wallapop PRO benefits.`;
  }
}
