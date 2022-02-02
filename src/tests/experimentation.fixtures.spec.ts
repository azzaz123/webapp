import { of } from 'rxjs';

export const OptimizelyServiceMock = {
  initialize: () => {},
  isReady$: of(false),
  initExperimentContext: () => {},
  getVariations: () => {},
  track: () => {},
};

export const OptimizeServiceMock = {
  getVariant: () => {},
};
