import { TestBed } from '@angular/core/testing';

import { ContinueToPayPalService } from './continue-to-pay-pal.service';

describe('ContinueToPayPalService', () => {
  let service: ContinueToPayPalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContinueToPayPalService],
    });
    service = TestBed.inject(ContinueToPayPalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
