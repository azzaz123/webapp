import { StarterResponse } from './trust-and-safety.interface';

export const MockTrustAndSafetyService = {
  initializeProfiling() {}
};

export const MOCK_STARTER_USER_RESPONSE: StarterResponse = {
  starter: true
};

export const MOCK_NON_STARTER_USER_RESPONSE: StarterResponse = {
  starter: false
};
