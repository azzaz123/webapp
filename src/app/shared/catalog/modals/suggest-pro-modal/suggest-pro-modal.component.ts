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
    return this.isFreeTrial ? $localize`:@@startFreeTrial:Start free trial` : $localize`:@@seePlans:See plans`;
  }

  get descriptionText(): string {
    return this.isFreeTrial
      ? $localize`:@@SuggestProModalDescriptionTrial:Try Wallapop PRO for free and explore all their benefits.`
      : $localize`:@@SuggestProModalDescriptionPlans:Choose a plan and take advantage of Wallapop PRO benefits.`;
  }
}
