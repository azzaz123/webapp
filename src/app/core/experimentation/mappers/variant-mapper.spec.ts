import { mapExperimentationCodeToValueForOptimize } from './variant-mapper';

describe('GIVEN the mapExperimentationCodeToValueForOptimize', () => {
  describe('WHEN mapping a response from Optimize API', () => {
    it('should map to Baseline when the response equals to 0', () => {
      const expected = 'Baseline';

      const result = mapExperimentationCodeToValueForOptimize(0);

      expect(result).toEqual(expected);
    });

    it('should map to Variant-n when the response equals to any number but 0', () => {
      const expected1 = 'Variant-1';
      const expected2 = 'Variant-3';
      const expected3 = 'Variant-7';

      const result1 = mapExperimentationCodeToValueForOptimize(1);
      const result2 = mapExperimentationCodeToValueForOptimize(3);
      const result3 = mapExperimentationCodeToValueForOptimize(7);

      expect(result1).toEqual(expected1);
      expect(result2).toEqual(expected2);
      expect(result3).toEqual(expected3);
    });

    it('should map to Baseline when the response is not a number', () => {
      const expected = 'Baseline';

      const result = mapExperimentationCodeToValueForOptimize(undefined);

      expect(result).toEqual(expected);
    });
  });
});
