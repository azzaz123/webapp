import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { Tier } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-try-pro-slot',
  templateUrl: './try-pro-slot.component.html',
  styleUrls: ['./try-pro-slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TryProSlotComponent {
  @Input() hasTrialAvailable: boolean;
  @Input() tierWithDiscount: Tier;
  @Output() clickClose: EventEmitter<void> = new EventEmitter();
  @Output() clickCTA: EventEmitter<void> = new EventEmitter();

  get CTAtext(): string {
    if (this.hasTrialAvailable) {
      return $localize`:@@web_free_trial:Free trial`;
    }
    return this.tierWithDiscount
      ? $localize`:@@listing_limit_non_pro_users_discount_modal_start_button:Try with ${this.tierWithDiscount.discount.percentage}:INTERPOLATION:% discount`
      : $localize`:@@web_know_more:Know more`;
  }

  public onClose(): void {
    this.clickClose.emit();
  }

  public onClick(): void {
    this.clickCTA.emit();
  }
}
