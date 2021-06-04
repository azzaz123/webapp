import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { Observable, of } from 'rxjs';

export const mockFeatureFlagsResponses = [
  { name: 'flag1', active: false },
  { name: 'flag2', active: true },
  { name: 'flag3', active: false },
];

export enum mockFeatureFlagsEnum {
  FLAG1 = 'flag1',
  FLAG2 = 'flag2',
  FLAG3 = 'flag3',
}

export class FeatureFlagServiceMock {
  getFlag(_flag: FEATURE_FLAGS_ENUM): Observable<boolean> {
    return of(true);
  }
  getLocalFlag(_flag: FEATURE_FLAGS_ENUM): Observable<boolean> {
    return of(true);
  }
  isExperimentalFeaturesEnabled() {}
}
