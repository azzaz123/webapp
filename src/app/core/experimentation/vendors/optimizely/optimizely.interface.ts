import { ANALYTICS_EVENT_NAMES } from '@core/analytics/analytics-constants';
import { OptimizelyDecideOption, UserAttributes } from '@optimizely/optimizely-sdk/lib/shared_types';
import { OPTIMIZELY_EXPERIMENT_KEYS } from './resources/optimizely-experiment-keys';
import { OPTIMIZELY_FEATUREFLAG_KEYS } from './resources/optimizely-featureflag-keys';

export type OPTIMIZELY_FLAG_KEYS = OPTIMIZELY_EXPERIMENT_KEYS | OPTIMIZELY_FEATUREFLAG_KEYS;

export interface FlagsParamInterface {
  flagKeys: OPTIMIZELY_FLAG_KEYS[];
  options?: OptimizelyDecideOption[];
}

export interface TrackParamsInterface {
  eventKey: ANALYTICS_EVENT_NAMES;
  eventTags?: { [key: string]: string };
}

export interface OnDecisionCallbackInterface {
  type: string;
  userId: string;
  attributes: UserAttributes;
  decisionInfo: {
    variationKey: string | null;
    enabled: boolean;
    variables: { [variableKey: string]: unknown };
    ruleKey: string | null;
    flagKey: string;
    reasons: string[];
    decisionEventDispatcher: boolean;
  };
}
