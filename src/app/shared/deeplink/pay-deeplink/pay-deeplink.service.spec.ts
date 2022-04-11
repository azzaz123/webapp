import { TestBed } from '@angular/core/testing';

import { PayDeeplinkService } from './pay-deeplink.service';

describe('PayDeeplinkService', () => {
  let service: PayDeeplinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayDeeplinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
