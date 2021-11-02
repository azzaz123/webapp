import { Variant } from '../models';

export function mapExperimentationCodeToValueForOptimize(input: number | any): Variant {
  if (typeof input === 'number' && input != 0) {
    let variant: Variant = `Variant-${input}` as Variant;
    return variant;
  } else {
    return 'Baseline';
  }
}
