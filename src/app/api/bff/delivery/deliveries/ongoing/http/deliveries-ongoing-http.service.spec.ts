import { TestBed } from '@angular/core/testing';

import { DeliveriesOngoingHttpService } from './deliveries-ongoing-http.service';

describe('DeliveriesOngoingHttpService', () => {
  let service: DeliveriesOngoingHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveriesOngoingHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
