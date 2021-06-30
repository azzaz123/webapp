import { Component, OnInit } from '@angular/core';
import { KYC_SLIDER_INFO_STEPS } from './kyc-info-slider-steps-constants';

@Component({
  selector: 'tsl-kyc-info-slider',
  templateUrl: './kyc-info-slider.component.html',
  styleUrls: ['./kyc-info-slider.component.scss'],
})
export class KycInfoSliderComponent implements OnInit {
  public readonly KYC_SLIDER_INFO_STEPS = KYC_SLIDER_INFO_STEPS;

  constructor() {}

  ngOnInit(): void {}
}
