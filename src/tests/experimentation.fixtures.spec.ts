import { of } from 'rxjs';

export const OptimizelyServiceMock = {
  initialize: () => {},
  isReady$: of(false),
  getVariations: () => {},
  setNewOptimizelyUserAttributes: () => {},
};

export const OptimizeServiceMock = {
  getVariant: () => {},
};

export const ExperimentationServiceMock = {
  initializeExperimentationWithAuthenticatedUser: () => {},
  initializeExperimentationWithUnauthenticatedUser: () => {},
  initExperimentContext: () => {},
  getVariations: () => {},
  initializeOptimizelyService: () => {},
};
