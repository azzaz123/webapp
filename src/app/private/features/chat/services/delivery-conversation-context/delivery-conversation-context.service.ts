import { Injectable } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { MOCK_DELVIVERY_BANNER_BUY_NOW_PROPERTIES } from '@fixtures/chat/delivery-banner/delivery-banner.fixtures.spec';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DeliveryBanner } from '../../modules/delivery-banner/interfaces/delivery-banner.interface';

@Injectable()
export class DeliveryConversationContextService {
  constructor(private featureFlagService: FeatureFlagService) {}

  private _bannerProperties$: ReplaySubject<DeliveryBanner> = new ReplaySubject(1);

  public get bannerProperties$(): Observable<DeliveryBanner | null> {
    return this._bannerProperties$.asObservable();
  }

  private set bannerProperties(newBannerProperties: DeliveryBanner) {
    this._bannerProperties$.next(newBannerProperties);
  }

  private get isDeliveryFlagEnabled(): Observable<boolean> {
    return this.featureFlagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).pipe(take(1));
  }

  public update(): void {
    this.isDeliveryFlagEnabled.subscribe((enabled: boolean) => {
      const isDeliveryDisabled: boolean = !enabled;
      if (isDeliveryDisabled) {
        this.bannerProperties = null;
        return;
      }

      const newBannerProperties: DeliveryBanner = this.buildBannerProperties();
      this.bannerProperties = newBannerProperties;
      return;
    });
  }

  private buildBannerProperties(): DeliveryBanner {
    return MOCK_DELVIVERY_BANNER_BUY_NOW_PROPERTIES;
  }
}
