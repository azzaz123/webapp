import { AnalyticsEvent, AnalyticsPageView } from '@core/analytics/analytics-constants';
import { Observable, ReplaySubject } from 'rxjs';
import {Market} from '../configs/market.config';
import {APP_LOCALE} from '../configs/subdomains.config';

export class MockAnalyticsService {
  private _mParticleReady$: ReplaySubject<void> = new ReplaySubject<void>();

  get market(): Market {
    return 'ES'
  }

  get appLocale(): APP_LOCALE {
    return 'es'
  }


  public get mParticleReady$(): Observable<void> {
    return this._mParticleReady$.asObservable();
  }
  initialize() {
    this._mParticleReady$.next();
  }
  trackEvent<T>(_event: AnalyticsEvent<T>) {}
  trackPageView<T>(_page: AnalyticsPageView<T>) {}
  getDeviceId() {}
}
