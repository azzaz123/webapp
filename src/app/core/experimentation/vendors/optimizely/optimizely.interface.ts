import { OptimizelyDecideOption } from '@optimizely/optimizely-sdk';
import { OPTIMIZELY_FLAG_KEYS } from './resources/optimizely-flag-keys';

export interface FlagsParamInterface {
  flagKeys: OPTIMIZELY_FLAG_KEYS[];
  options?: OptimizelyDecideOption[];
}
