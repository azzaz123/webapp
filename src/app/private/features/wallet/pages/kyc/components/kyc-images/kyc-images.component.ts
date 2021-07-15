import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-kyc-images',
  templateUrl: './kyc-images.component.html',
  styleUrls: ['./kyc-images.component.scss'],
})
export class KycImagesComponent {
  @Input() photosToTake: number;

  constructor() {}
}
