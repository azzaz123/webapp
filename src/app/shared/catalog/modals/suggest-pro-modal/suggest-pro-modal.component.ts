import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-suggest-pro-modal',
  templateUrl: './suggest-pro-modal.component.html',
  styleUrls: ['./suggest-pro-modal.component.scss'],
})
export class SuggestProModalComponent {
  @Input() isFreeTrial: boolean;
  @Input() title: string;

  constructor(public activeModal: NgbActiveModal) {}

  get buttonText(): string {
    return this.isFreeTrial ? $localize`:@@web_start_free_trial:Start free trial` : $localize`:@@web_see_plans:See plans`;
  }

  get descriptionText(): string {
    return this.isFreeTrial
      ? $localize`:@@web_suggest_pro_modal_description_trial:Try Wallapop PRO for free and explore all their benefits.`
      : $localize`:@@web_suggest_pro_modal_description_plans:Choose a plan and take advantage of Wallapop PRO benefits.`;
  }
}
