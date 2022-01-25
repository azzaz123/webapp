import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { DeliveryBanner } from '../../interfaces/delivery-banner.interface';

@Injectable()
export class DeliveryBannerService {
  private _bannerProperties$: ReplaySubject<DeliveryBanner> = new ReplaySubject(1);

  public get bannerProperties$(): Observable<DeliveryBanner | null> {
    return this._bannerProperties$.asObservable();
  }

  public update(): void {
    this._bannerProperties$.next(null);
  }
}
