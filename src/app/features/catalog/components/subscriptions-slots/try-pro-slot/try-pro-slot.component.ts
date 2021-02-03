import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'tsl-try-pro-slot',
  templateUrl: './try-pro-slot.component.html',
  styleUrls: ['./try-pro-slot.component.scss'],
})
export class TryProSlotComponent {
  @Input() hasTrialAvailable: boolean;
  @Output() close: EventEmitter<void> = new EventEmitter();
  @Output() clickCTA: EventEmitter<void> = new EventEmitter();

  constructor() {}

  get CTAtext(): string {
    return this.hasTrialAvailable
      ? $localize`:@@TryProSlotCTAtrial:Become a PRO for free`
      : $localize`:@@TryProSlotCTAPlans:More information`;
  }

  public onClose(): void {
    this.close.emit();
  }

  public onClick(): void {
    this.clickCTA.emit();
  }
}
