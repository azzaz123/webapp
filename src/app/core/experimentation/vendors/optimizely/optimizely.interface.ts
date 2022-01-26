import { OPTIMIZELY_EXPERIMENTS } from './resources/optimizely-experiment-keys';
import { OPTIMIZELY_FEATURES } from './resources/optimizely-feature-keys';

export interface ExperimentationParamInterface {
  experimentKey: OPTIMIZELY_EXPERIMENTS;
  attributes?: { [key: string]: string };
}

export interface FeatureParamInterface {
  featureKey: OPTIMIZELY_FEATURES;
  attributes?: { [key: string]: string };
}
