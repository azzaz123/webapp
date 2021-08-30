import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-kyc-status',
  templateUrl: './kyc-status.component.html',
  styleUrls: ['./kyc-status.component.scss'],
})
export class KYCStatusComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() svgPath: string;
  @Input() linkPath: string;
  @Input() messageCTA: string;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
}
