import { TestBed } from '@angular/core/testing';

import { WalletHistoryMovementsUIService } from './wallet-history-movements-ui.service';

describe('WalletHistoryMovementsUIService', () => {
  let service: WalletHistoryMovementsUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletHistoryMovementsUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
