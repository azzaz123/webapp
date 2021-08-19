import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Tier } from '@core/subscriptions/subscriptions.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-become-pro-modal',
  templateUrl: './become-pro-modal.component.html',
  styleUrls: ['./become-pro-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeProModalComponent {
  @Input() hasTrialAvailable: boolean;
  @Input() tierWithDiscount: Tier;

  constructor(public activeModal: NgbActiveModal) {}

  get CTAtext(): string {
    if (this.hasTrialAvailable) {
      return $localize`:@@web_free_trial:Free trial`;
    }
    return this.tierWithDiscount
      ? $localize`:@@listing_limit_non_pro_users_discount_modal_start_button:Try with ${this.tierWithDiscount.discount.percentage}:INTERPOLATION:% discount`
      : $localize`:@@web_know_more:Know more`;
  }
}
