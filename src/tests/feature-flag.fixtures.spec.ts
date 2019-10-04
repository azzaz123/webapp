import { Observable } from 'rxjs';
import { FeatureFlagResponse, FEATURE_FLAGS_ENUM } from '../app/core/user/featureflag.service';

export const mockFeatureFlags: FeatureFlagResponse[] = [
  { name: 'flag1', isActive: false },
  { name: 'flag2', isActive: true },
  { name: 'flag3', isActive: false }
];

export enum mockFeatureFlagsEnum {
  FLAG1 = 'flag1',
  FLAG2 = 'flag2',
  FLAG3 = 'flag3'
}

export class FeatureFlagServiceMock {
  getFlag(_flag: FEATURE_FLAGS_ENUM): Observable<boolean> {
    return Observable.of(true);
  }
}
