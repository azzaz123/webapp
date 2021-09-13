import { of } from 'rxjs';

export const MockWalletSharedErrorActionService = {
  errorObserver: () => of(),
  show(data?: unknown): void {},
};
