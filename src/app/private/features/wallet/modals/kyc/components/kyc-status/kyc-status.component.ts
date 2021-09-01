import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KYCModalStatus } from '../../interfaces/kyc-modal-status.interface';

@Component({
  selector: 'tsl-kyc-status',
  templateUrl: './kyc-status.component.html',
  styleUrls: ['./kyc-status.component.scss'],
})
export class KYCStatusComponent {
  @Input() properties: KYCModalStatus;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
}
