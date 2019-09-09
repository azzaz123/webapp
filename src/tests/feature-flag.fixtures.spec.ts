import { Observable } from 'rxjs';

export class FeatureFlagServiceMock {
  getFlag(): Observable<boolean> {
    return Observable.of(true);
  }

  getWebInboxProjections(): Observable<boolean> {
    return Observable.of(true);
  }
}
