import { Variant } from '../models';

export function mapExperimentationCodeToValueForOptimize(input: number | any): Variant {
  if (typeof input === 'number' && input != 0) {
    return `Variant-${input}`;
  } else {
    return 'Baseline';
  }
}
