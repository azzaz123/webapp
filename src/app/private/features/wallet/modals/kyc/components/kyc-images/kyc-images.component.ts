import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-kyc-images',
  templateUrl: './kyc-images.component.html',
  styleUrls: ['./kyc-images.component.scss'],
})
export class KYCImagesComponent {
  @Input() photosToRequest: number;

  constructor() {}
}
