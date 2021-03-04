import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-become-pro-modal',
  templateUrl: './become-pro-modal.component.html',
  styleUrls: ['./become-pro-modal.component.scss'],
})
export class BecomeProModalComponent {
  @Input() hasTrialAvailable: boolean;

  constructor(public activeModal: NgbActiveModal) {}

  get CTAtext(): string {
    return this.hasTrialAvailable ? $localize`:@@FreeTrial:Free trial` : $localize`:@@KnowMore:Know more`;
  }
}