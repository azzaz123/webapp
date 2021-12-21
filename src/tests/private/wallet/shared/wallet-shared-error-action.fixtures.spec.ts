import { of } from 'rxjs';

export const MockSharedErrorActionService = {
  errorObserver: () => of(),
  show(data?: unknown): void {},
};
