import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DeliveryBanner } from './interfaces/delivery-banner.interface';
import { DeliveryBannerService } from './services/delivery-banner/delivery-banner.service';

@Component({
  selector: 'tsl-delivery-banner',
  templateUrl: './delivery-banner.component.html',
  styleUrls: ['./delivery-banner.component.scss'],
})
export class DeliveryBannerComponent implements OnInit {
  constructor(private deliveryBannerService: DeliveryBannerService) {}

  public get bannerProperties$(): Observable<DeliveryBanner> {
    return this.deliveryBannerService.bannerProperties$;
  }

  ngOnInit() {
    this.deliveryBannerService.update();
  }
}
