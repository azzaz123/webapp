import { Observable } from 'rxjs';

export class FeatureFlagServiceMock {
  getFlag(): Observable<boolean> {
    return Observable.of(false);
  }

  getWebInboxProjections(): Observable<boolean> {
    return Observable.of(false);
  }
}
