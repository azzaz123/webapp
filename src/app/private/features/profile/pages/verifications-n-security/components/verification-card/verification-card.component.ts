import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-verification-card',
  templateUrl: './verification-card.component.html',
  styleUrls: ['./verification-card.component.scss'],
})
export class VerificationCardComponent {
  @Input() isVerified: boolean;
  @Input() title: string;
  @Input() footerLegend: string;
  @Input() textButton: string;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();
  constructor() {}

  public onButtonClick(): void {
    this.buttonClick.emit();
  }
}
