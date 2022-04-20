import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VERIFICATIONS_N_SECURITY_STATUS } from '../../interfaces/verifications-n-security-status.enum';

@Component({
  selector: 'tsl-verification-card',
  templateUrl: './verification-card.component.html',
  styleUrls: ['./verification-card.component.scss'],
})
export class VerificationCardComponent {
  @Input() status: VERIFICATIONS_N_SECURITY_STATUS;
  @Input() title: string;
  @Input() footerLegend: string;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();

  public readonly VERIFICATIONS_N_SECURITY_STATUS = VERIFICATIONS_N_SECURITY_STATUS;

  public onButtonClick(): void {
    this.buttonClick.emit();
  }
}
