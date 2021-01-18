import {
  AnalyticsEvent,
  AnalyticsPageView,
} from '@core/analytics/analytics-constants';
import { Observable, ReplaySubject } from 'rxjs';

export class MockAnalyticsService {
  private _mParticleReady$: ReplaySubject<void> = new ReplaySubject<void>();
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
