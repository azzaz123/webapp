import { Component } from '@angular/core';
import { KYC_SLIDER_INFO_STEPS } from './kyc-info-modal-constants';

@Component({
  selector: 'tsl-kyc-info-modal',
  templateUrl: './kyc-info-modal.component.html',
  styleUrls: ['./kyc-info-modal.component.scss'],
})
export class KycInfoModalComponent {
  public readonly KYC_SLIDER_INFO_STEPS = KYC_SLIDER_INFO_STEPS;
}
