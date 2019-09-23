import { Observable } from 'rxjs';
import { FeatureFlagResponse } from '../app/core/user/featureflag.service';

export const mockFeatureFlags: FeatureFlagResponse[] = [
  { name: 'flag1', active: false },
  { name: 'flag2', active: true },
  { name: 'flag3', active: false }
];

export class FeatureFlagServiceMock {
  getFlag(): Observable<boolean> {
    return Observable.of(true);
  }

  getWebInboxProjections(): Observable<boolean> {
    return Observable.of(true);
  }
}
