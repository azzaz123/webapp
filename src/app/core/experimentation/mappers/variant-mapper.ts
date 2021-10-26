import { Variant } from '../models';

export function mapExperimentationCodeToValueForOptimize(input: number): Variant {
  switch (input) {
    case 0:
      return 'Baseline';
    case 1:
      return 'Variant-1';
    case 2:
      return 'Variant-2';
    case 3:
      return 'Variant-3';
    case 4:
      return 'Variant-4';
    case 5:
      return 'Variant-5';
    default:
      return 'Baseline';
  }
}
