import { Variant } from '../models';

export function mapExperimentationCodeToValueForOptimize(input: number): Variant {
  if (input === 0 || !input) {
    return 'Baseline';
  } else {
    return `Variant-${input}`;
  }
}
