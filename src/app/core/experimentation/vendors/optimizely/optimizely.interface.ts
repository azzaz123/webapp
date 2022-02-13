import { ANALYTICS_EVENT_NAMES } from '@core/analytics/analytics-constants';
import { OptimizelyDecideOption, UserAttributes } from '@optimizely/optimizely-sdk';
import { OPTIMIZELY_FLAG_KEYS } from './resources/optimizely-flag-keys';

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
