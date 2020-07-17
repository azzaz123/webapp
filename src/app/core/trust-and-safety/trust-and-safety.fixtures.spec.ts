import { UserStarterResponse, SessionProfileDataLocation } from './trust-and-safety.interface';

export const MockTrustAndSafetyService = {
  submitProfileIfNeeded: (_location: SessionProfileDataLocation) => {}
};

export const MOCK_STARTER_USER_RESPONSE: UserStarterResponse = {
  starter: true
};

export const MOCK_NON_STARTER_USER_RESPONSE: UserStarterResponse = {
  starter: false
};
