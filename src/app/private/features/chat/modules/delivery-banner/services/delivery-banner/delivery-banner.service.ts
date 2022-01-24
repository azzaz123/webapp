import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { DELIVERY_BANNER_BUTTON_TYPE } from '../../enums/delivery-banner-button-type.enum';
import { ActionableDeliveryBanner } from '../../interfaces/actionable-delivery-banner.interface';
import { DeliveryBanner } from '../../interfaces/delivery-banner.interface';
import { DescriptiveDeliveryBanner } from '../../interfaces/descriptive-delivery-banner.interface';

// TODO: Move this to fixtures
const hardcodedOptions: DescriptiveDeliveryBanner & ActionableDeliveryBanner = {
  svgPath: 'assets/icons/explicit.svg',
  description: { text: 'Description', helpLink: 'www.google.com' },
  action: {
    label: 'Comprar',
    type: DELIVERY_BANNER_BUTTON_TYPE.CONTAINED,
  },
};

@Injectable()
export class DeliveryBannerService {
  private _bannerProperties$: ReplaySubject<DeliveryBanner> = new ReplaySubject(1);

  public get bannerProperties$(): Observable<DeliveryBanner> {
    return this._bannerProperties$.asObservable();
  }

  public update(): void {
    this._bannerProperties$.next(null);
  }
}
