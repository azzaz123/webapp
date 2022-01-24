import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'tsl-delivery-banner',
  templateUrl: './delivery-banner.component.html',
  styleUrls: ['./delivery-banner.component.scss'],
})
export class DeliveryBannerComponent {
  constructor() {}

  public get displayBanner$(): Observable<boolean> {
    return of(false);
  }
}
