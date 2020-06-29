import { StarterResponse, SessionProfileDataLocation } from './trust-and-safety.interface';
import { of } from 'rxjs';

export const MockTrustAndSafetyService = {
  isStarterUser: () => of(false),
  initializeProfiling: () => {},
  submitProfile: (_location: SessionProfileDataLocation) => {}
};

export const MOCK_STARTER_USER_RESPONSE: StarterResponse = {
  starter: true
};

export const MOCK_NON_STARTER_USER_RESPONSE: StarterResponse = {
  starter: false
};
