import { AnalyticsEvent, AnalyticsPageView } from '@core/analytics/analytics-constants';
import { Observable, ReplaySubject } from 'rxjs';
import { Market } from '@configs/market.config';
import { APP_LOCALE } from '@configs/subdomains.config';
import { UserIdentities } from '@mparticle/web-sdk';

export const MARKET_MOCK = 'ES';
export const APP_LOCALE_MOCK = 'es';

export class MockAnalyticsService {
  private _mParticleReady$: ReplaySubject<void> = new ReplaySubject<void>();

  get market(): Market {
    return MARKET_MOCK;
  }

  get appLocale(): APP_LOCALE {
    return APP_LOCALE_MOCK;
  }

  public get mParticleReady$(): Observable<void> {
    return this._mParticleReady$.asObservable();
  }
  initializeAnalyticsWithUnauthenticatedUser() {
    this._mParticleReady$.next();
  }
  trackEvent<T>(_event: AnalyticsEvent<T>) {}
  trackPageView<T>(_page: AnalyticsPageView<T>) {}
  getDeviceId() {}
  loginUser(userIdentities: UserIdentities, callback: () => void) {
    callback();
  }
}
